import os
import traceback
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes import studygen

# Automatically ensure required directories exist
os.makedirs("uploads", exist_ok=True)
os.makedirs(".chroma_db", exist_ok=True)
os.makedirs("backend/uploads", exist_ok=True)
os.makedirs("backend/.chroma_db", exist_ok=True)

app = FastAPI(title="CampusX AI Twin Backend", version="1.0")

# Explicit origins and regex to support localhost:3000, localhost:5173, etc.
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"\n[HTTP Request] {request.method} {request.url.path}")
    try:
        response = await call_next(request)
        print(f"[HTTP Response] {request.method} {request.url.path} -> Status {response.status_code}")
        return response
    except Exception as exc:
        print(f"[HTTP Error] {request.method} {request.url.path} uncaught exception: {exc}")
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(exc),
                "detail": f"Internal server error: {exc}"
            }
        )

# Include StudyGen routes (/upload, /chat, /files, /delete)
app.include_router(studygen.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to CampusX AI Twin Backend"}
