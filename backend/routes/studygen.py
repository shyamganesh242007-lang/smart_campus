import os
import time
import traceback
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from services.rag_service import rag_service

router = APIRouter()

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)
os.makedirs(".chroma_db", exist_ok=True)

ALLOWED_EXTENSIONS = {
    'pdf', 'docx', 'pptx', 'ppt', 'txt', 'md', 'markdown',
    'png', 'jpg', 'jpeg', 'webp'
}

# In-memory session store for uploaded file metadata
file_metadata_store = {}


class ChatRequest(BaseModel):
    question: str


class DeleteFileRequest(BaseModel):
    filename: str


@router.get("/files")
async def get_active_files():
    """Returns the list of active documents and metadata currently stored in the session."""
    active_files = []
    for fn, data in rag_service.uploaded_files.items():
        meta = file_metadata_store.get(fn, {})
        active_files.append({
            "name": fn,
            "filename": fn,
            "fileType": data.get("fileType") or meta.get("fileType", ""),
            "chunkCount": data.get("total_chunks", data.get("chunkCount", 0)),
            "uploadTime": meta.get("uploadTime", data.get("timestamp"))
        })

    return {
        "success": True,
        "files": active_files
    }


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Handles file upload with validation for empty files, unsupported formats,
    stores file metadata, creates backup in uploads/, and indexes content in rag_service.
    Returns HTTP 500 with exact error message on failure.
    """
    print(f"\n[StudyGen Backend] Received upload request: filename='{getattr(file, 'filename', None)}', content_type='{getattr(file, 'content_type', None)}'")

    if not file or not file.filename:
        err_msg = "No file provided in request."
        print(f"[StudyGen Backend] Validation error: {err_msg}")
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": err_msg}
        )

    filename = file.filename.strip()
    ext = filename.split('.')[-1].lower() if '.' in filename else ''
    print(f"[StudyGen Backend] File details: name='{filename}', extension='{ext}'")

    if ext not in ALLOWED_EXTENSIONS:
        err_msg = f"Unsupported file format: '{ext}'. Supported formats are PDF, DOCX, PPTX, TXT, MD."
        print(f"[StudyGen Backend] Validation error: {err_msg}")
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": err_msg}
        )

    try:
        content = await file.read()
        if not content or len(content) == 0:
            err_msg = "Uploaded file is empty (0 bytes)."
            print(f"[StudyGen Backend] Validation error: {err_msg}")
            return JSONResponse(
                status_code=400,
                content={"success": False, "error": err_msg}
            )

        print(f"[StudyGen Backend] Successfully read {len(content)} bytes for '{filename}'. Storing copy and processing RAG...")

        # Ensure uploads folder exists and save a copy
        try:
            uploads_dir = os.path.abspath("uploads")
            os.makedirs(uploads_dir, exist_ok=True)
            save_dest = os.path.join(uploads_dir, filename)
            with open(save_dest, "wb") as f_out:
                f_out.write(content)
            print(f"[StudyGen Backend] Saved backup copy to: {save_dest}")
        except Exception as save_err:
            print(f"[StudyGen Backend] Notice: could not save backup copy to uploads/: {save_err}")

        # Process file with RAG service
        processed_ext = rag_service.process_file(content, filename)
        upload_timestamp = time.time()

        # Update in-memory session metadata store
        file_metadata_store[filename] = {
            "filename": filename,
            "fileType": processed_ext,
            "uploadTime": upload_timestamp,
            "size": len(content)
        }

        print(f"[StudyGen Backend] File '{filename}' successfully indexed! ({processed_ext})")
        return {
            "success": True,
            "message": "Indexed successfully",
            "fileType": processed_ext,
            "filename": filename,
            "uploadTime": upload_timestamp
        }

    except Exception as e:
        err_detail = str(e)
        print(f"[StudyGen Backend ERROR] Upload processing failed for '{filename}': {err_detail}")
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": f"Upload processing failed: {err_detail}",
                "detail": traceback.format_exc()
            }
        )


@router.post("/delete")
async def delete_file(request: DeleteFileRequest):
    """Removes a file from the active session and metadata store."""
    try:
        rag_service.delete_file(request.filename)
        file_metadata_store.pop(request.filename, None)
        return {"success": True, "message": f"File {request.filename} removed"}
    except Exception as e:
        print(f"[StudyGen Backend ERROR] Delete failed for {request.filename}: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": f"Unable to remove file: {str(e)}"}
        )


@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Handles user queries by sending the normalized question to rag_service.
    Returns consistent JSON response:
    {
      "answer": "...",
      "source": "document|ai",
      "sourceDoc": "filename",
      "fileType": "docx|pdf|pptx|txt|md"
    }
    """
    if not request.question or not request.question.strip():
        return {
            "answer": "Please ask a question.",
            "source": "ai",
            "sourceDoc": "Gemini AI",
            "fileType": None
        }

    try:
        # Send the question to rag_service (which normalizes internally for retrieval and uses natural text for Gemini)
        result = await rag_service.ask_question(request.question)

        # Ensure consistent source and metadata mapping
        source = "document" if result.get("source") in ["document", "file"] else "ai"
        source_doc = result.get("sourceDoc", "Gemini AI") if source == "document" else "Gemini AI"
        file_type = result.get("fileType") if source == "document" else None

        # Fallback fileType from filename if not populated
        if source == "document" and not file_type and source_doc and "." in source_doc:
            file_type = source_doc.split(".")[-1].lower()

        return {
            "answer": result.get("answer", "No answer generated."),
            "fileAnswer": result.get("fileAnswer"),
            "aiAnswer": result.get("aiAnswer"),
            "source": source,
            "sourceDoc": source_doc,
            "fileType": file_type,
            "marks": result.get("marks"),
            "intent": result.get("intent")
        }
    except Exception as e:
        print(f"[StudyGen Backend ERROR] Chat failed: {e}")
        traceback.print_exc()
        return {
            "answer": "An error occurred while answering your question. Please try again.",
            "fileAnswer": None,
            "aiAnswer": "An error occurred while answering your question. Please try again.",
            "source": "ai",
            "sourceDoc": "Gemini AI",
            "fileType": None,
            "marks": None,
            "intent": "general"
        }
