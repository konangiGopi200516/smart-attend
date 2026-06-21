import base64
import os
import cv2
import numpy as np
from deepface import DeepFace
from firebase.firebase_config import db

def base64_to_image(base64_str: str) -> np.ndarray:
    """Converts a base64 string to an OpenCV numpy image."""
    if ',' in base64_str:
        base64_str = base64_str.split(',')[1]
    img_data = base64.b64decode(base64_str)
    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

def get_face_embedding(image_base64: str) -> list:
    """Extracts a 128-dimensional face embedding using DeepFace Facenet model."""
    img = base64_to_image(image_base64)
    try:
        # We use Facenet which produces a 128-d or 512-d vector
        results = DeepFace.represent(img_path=img, model_name="Facenet", enforce_detection=True)
        if len(results) > 0:
            return results[0]["embedding"]
        return []
    except Exception as e:
        print(f"Error extracting embedding: {e}")
        return []

def cosine_similarity(vecA, vecB):
    """Computes cosine similarity between two vectors."""
    a = np.array(vecA)
    b = np.array(vecB)
    dot_product = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot_product / (norm_a * norm_b)

def compare_face_with_section(live_embedding: list, section_id: str):
    """Fetches all students in the given section and finds the best matching embedding."""
    students_ref = db.collection("students").where("section", "==", section_id).stream()
    
    best_match = None
    highest_similarity = -1.0
    THRESHOLD = 0.65  # Adjust based on chosen model

    for student in students_ref:
        data = student.to_dict()
        stored_embedding = data.get("embedding")
        
        if stored_embedding and isinstance(stored_embedding, list):
            sim = cosine_similarity(live_embedding, stored_embedding)
            if sim > highest_similarity:
                highest_similarity = sim
                best_match = data
                
    if highest_similarity > THRESHOLD and best_match:
        return {
            "matched": True,
            "studentId": best_match.get("studentId"),
            "name": best_match.get("name"),
            "confidence": round(highest_similarity * 100, 2)
        }
    
    return {"matched": False}
