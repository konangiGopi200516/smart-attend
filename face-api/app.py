from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from services.face_recognition import get_face_embedding, compare_face_with_section
from services.attendance import mark_student_present
from firebase.firebase_config import db

app = FastAPI(title="SmartAttend Face Recognition API")

class RegisterFaceRequest(BaseModel):
    studentId: str
    image: str # Base64 encoded image string

class RecognizeFaceRequest(BaseModel):
    section: str
    image: str # Base64 encoded image string

class MarkAttendanceRequest(BaseModel):
    studentId: str
    section: str

@app.post("/api/register-face")
async def register_face(req: RegisterFaceRequest):
    """
    Receives a Base64 image, uses DeepFace to generate a face embedding,
    and stores it in Firestore.
    """
    embedding = get_face_embedding(req.image)
    if not embedding:
        raise HTTPException(status_code=400, detail="Could not detect face in the provided image.")
        
    try:
        db.collection("students").document(req.studentId).set({"embedding": embedding}, merge=True)
        return {"success": True, "message": "Face Registered Successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recognize-face")
async def recognize_face(req: RecognizeFaceRequest):
    """
    Receives a live camera frame, generates embedding, and compares it 
    against all students in the given section.
    """
    live_embedding = get_face_embedding(req.image)
    if not live_embedding:
        return {"matched": False, "error": "No face detected in frame"}

    result = compare_face_with_section(live_embedding, req.section)
    return result

@app.post("/api/mark-attendance")
async def mark_attendance(req: MarkAttendanceRequest):
    """
    Writes the official attendance record to Firestore.
    """
    success = mark_student_present(req.studentId, req.section)
    if success:
        return {"success": True, "status": "Present"}
    raise HTTPException(status_code=500, detail="Failed to save attendance record")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
