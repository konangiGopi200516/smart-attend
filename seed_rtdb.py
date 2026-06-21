from face_api.firebase.firebase_config import realtime_db

def seed_database():
    print("Attempting to seed Realtime Database...")
    try:
        # Add some sample students
        realtime_db.reference('students').child('23CSE0001').set({
            "name": "Ravi Kumar",
            "department": "CSE",
            "section": "CSE-A",
            "faceRegistered": True
        })
        
        realtime_db.reference('students').child('23CSE0002').set({
            "name": "Priya Sharma",
            "department": "CSE",
            "section": "CSE-A",
            "faceRegistered": False
        })

        # Add some sample faculty
        realtime_db.reference('faculty').child('EMP-CS01').set({
            "name": "Dr. Suresh Rao",
            "department": "CSE",
            "role": "faculty"
        })

        # Add admin
        realtime_db.reference('admins').child('KONANGIGOPI').set({
            "name": "KONANGI GOPI",
            "role": "admin"
        })

        print("Successfully seeded Realtime Database! ✅")
    except Exception as e:
        print(f"Error seeding Realtime Database: {e}")

if __name__ == "__main__":
    seed_database()
