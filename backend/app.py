from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ap_logic import calculate_ap

app = FastAPI(
    title="Airway Patency API",
    description="Backend API for Health Kiosk",
    version="1.0.0"
)

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if not ap_scores:
    return {
        "ap_scores": [],
        "frames": 0,
        "warning": "No valid humming detected"
    }



@app.get("/")
def root():
    return {
        "status": "AP backend running",
        "endpoint": "/ap-score"
    }


@app.post("/ap-score")
async def ap_score(file: UploadFile = File(...)):
    """
    Receives audio from frontend and returns AP scores.
    """
    audio_bytes = await file.read()

    ap_scores = calculate_ap(audio_bytes)

    return {
        "ap_scores": ap_scores,
        "frames": len(ap_scores)
    }
