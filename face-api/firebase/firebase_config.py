import firebase_admin
from firebase_admin import credentials, db
import os

def initialize_firebase():
    try:
        # Check if already initialized
        firebase_admin.get_app()
    except ValueError:
        # Not initialized yet
        key_path = os.environ.get("FIREBASE_SERVICE_ACCOUNT_KEY", "serviceAccountKey.json")
        
        # We must configure the Realtime Database URL
        options = {
            'databaseURL': 'https://smart-attend-88a93-default-rtdb.firebaseio.com/'
        }

        if os.path.exists(key_path):
            cred = credentials.Certificate(key_path)
            firebase_admin.initialize_app(cred, options)
            print("Firebase initialized with Service Account Key (Realtime Database).")
        else:
            print("WARNING: serviceAccountKey.json not found. Connecting with default app.")
            firebase_admin.initialize_app(options=options)
            
    return db

realtime_db = initialize_firebase()
