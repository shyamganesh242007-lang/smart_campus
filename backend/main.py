from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import studygen

app = FastAPI(title="CampusX AI Twin Backend", version="1.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(studygen.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to CampusX AI Twin Backend"}
