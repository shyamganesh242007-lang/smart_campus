import os
from dotenv import load_dotenv

load_dotenv()
import io
import docx
import pptx
import shutil
from PIL import Image
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma

class RAGService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.ocr_reader = None
        self.document_text = None
        self.file_type = None
        
        try:
            self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
            
            persist_dir = "./.chroma_db"
            if os.path.exists(persist_dir):
                try:
                    shutil.rmtree(persist_dir)
                except Exception:
                    pass
                    
            self.vectorstore = Chroma(persist_directory=persist_dir, embedding_function=self.embeddings)
        except Exception as e:
            import traceback
            print("Failed to initialize HuggingFace embeddings or Chroma:")
            traceback.print_exc()
            self.embeddings = None
            self.vectorstore = None

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=900,
            chunk_overlap=180,
            separators=["\n\n","\n",". "," "]
        )

    def _get_ocr_reader(self):
        if self.ocr_reader is None:
            import easyocr
            self.ocr_reader = easyocr.Reader(['en'], gpu=False)
        return self.ocr_reader

    def process_file(self, file_bytes: bytes, filename: str) -> str:
        if not self.embeddings:
            raise Exception("Embedding model initialization failed.")
            
        try:
            ext = filename.split('.')[-1].lower() if '.' in filename else ''
            text = ""
            
            if ext == 'pdf':
                reader = PdfReader(io.BytesIO(file_bytes))
                for page in reader.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n\n"
                        
            elif ext == 'docx':
                doc = docx.Document(io.BytesIO(file_bytes))
                for para in doc.paragraphs:
                    text += para.text + "\n\n"
                    
            elif ext == 'pptx':
                prs = pptx.Presentation(io.BytesIO(file_bytes))
                for slide in prs.slides:
                    for shape in slide.shapes:
                        if hasattr(shape, "text"):
                            text += shape.text + "\n\n"
                            
            elif ext == 'txt':
                text = file_bytes.decode('utf-8', errors='ignore')
                
            elif ext in ['png', 'jpg', 'jpeg', 'webp']:
                reader = self._get_ocr_reader()
                result = reader.readtext(file_bytes, detail=0)
                text = " ".join(result)
                
            else:
                raise Exception(f"Unsupported file format: {ext}")

            if not text.strip():
                raise Exception("No text could be extracted from the file.")
                
            self.document_text = text
            self.file_type = ext
            
            chunks = self.text_splitter.split_text(text)
            
            # Recreate Collection During Upload to prevent dimension mismatches
            persist_dir = "./.chroma_db"
            if os.path.exists(persist_dir):
                try:
                    shutil.rmtree(persist_dir)
                except Exception:
                    pass
            self.vectorstore = Chroma(persist_directory=persist_dir, embedding_function=self.embeddings)
            
            # Create metadata array
            metadatas = [{"fileType": ext} for _ in chunks]
                
            import time
            batch_size = 10
            for i in range(0, len(chunks), batch_size):
                batch_chunks = chunks[i:i+batch_size]
                batch_metadatas = metadatas[i:i+batch_size]
                
                max_retries = 3
                for attempt in range(max_retries):
                    try:
                        self.vectorstore.add_texts(texts=batch_chunks, metadatas=batch_metadatas)
                        time.sleep(1) # Base delay to respect limits
                        break
                    except Exception as e:
                        if attempt < max_retries - 1:
                            time.sleep(2 ** attempt * 2)
                        else:
                            raise e
                            
            return ext
        except Exception as e:
            import traceback
            print(f"Error processing file {filename}:")
            traceback.print_exc()
            raise e

    async def ask_question(self, question: str) -> dict:
        import asyncio
        if not self.document_text:
            return {"answer": "No study material uploaded. Please upload a file first.", "source": "Source Not Available"}
                
        try:
            # Query Normalization
            ALIASES = {
                "dbms": "database management system",
                "rdbms": "relational database management system",
                "ddbms": "distributed database management system",
                "sql": "structured query language"
            }
            
            q = question.lower()
            import re
            for key, value in ALIASES.items():
                q = re.sub(rf'\b{key}\b', value, q)
                    
            # PHASE 1: KEYWORD SEARCH
            paragraphs = [
                p.strip()
                for p in self.document_text.split("\n\n")
                if len(p.strip()) > 30
            ]
            
            # Remove punctuation for better keyword matching
            q_clean = re.sub(r'[^\w\s]', '', q)
            query_words = q_clean.split()
            
            matches = []
            for para in paragraphs:
                text_lower = para.lower()
                score = 0
                for word in query_words:
                    if word in text_lower:
                        score += 1
                if score > 0:
                    matches.append((score, para))
                    
            matches.sort(reverse=True)
            
            # If we got a highly relevant paragraph, return it
            if matches and matches[0][0] >= 1:
                answer = "\n\n".join(para for _, para in matches[:3])
                return {
                    "answer": answer,
                    "source": "file",
                    "fileType": self.file_type
                }
                
            # PHASE 2: VECTOR SEARCH FALLBACK
            if self.vectorstore:
                docs_and_scores = await asyncio.to_thread(
                    self.vectorstore.similarity_search_with_score, 
                    q, 
                    k=8
                )
                
                valid_docs = []
                for doc, score in docs_and_scores:
                    if score < 0.65: # Lower distance threshold (0.55-0.65)
                        valid_docs.append(doc)
                        
                if valid_docs:
                    answer = "\n\n".join(doc.page_content for doc in valid_docs)
                    return {
                        "answer": answer,
                        "source": "file",
                        "fileType": self.file_type
                    }

            # FALLBACK
            return {
                "answer": "Answer not available in the uploaded document. Please ask a question related to the uploaded study material.",
                "source": "Source Not Available"
            }
            
        except Exception as e:
            print(f"[RAG] Error during retrieval: {e}")
            return {"answer": "An error occurred while retrieving the document.", "source": "Source Not Available"}

# Singleton instance
rag_service = RAGService()
