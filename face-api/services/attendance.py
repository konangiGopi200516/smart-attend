from firebase.firebase_config import realtime_db
import datetime

def mark_student_present(student_id: str, section: str):
    """
    Creates an attendance record in Realtime Database for the recognized student.
    """
    now = datetime.datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    time_str = now.strftime("%H:%M:%S")

    attendance_record = {
        "studentId": student_id,
        "section": section,
        "date": date_str,
        "time": time_str,
        "status": "Present"
    }

    try:
        # Push a new record under 'attendance'
        realtime_db.reference("attendance").push(attendance_record)
        return True
    except Exception as e:
        print(f"Error saving attendance to Realtime Database: {e}")
        return False
