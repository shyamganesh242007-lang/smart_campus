from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from services.rag_service import rag_service

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    
    try:
        # Read file contents
        content = await file.read()
        
        # Process the file using RAG service (will raise Exception if it fails)
        ext = rag_service.process_file(content, file.filename)
        
        return {
            "success": True,
            "message": "Indexed successfully",
            "fileType": ext
        }
    except Exception as e:
        import traceback
        print(f"Upload failed for {file.filename}:")
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e)
        }

@router.post("/chat")
async def chat(request: ChatRequest):
    if not request.question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")
        
    try:
        result = await rag_service.ask_question(request.question)
        return result
    except Exception as e:
        import traceback
        print("Chat failed:")
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e)
        }
