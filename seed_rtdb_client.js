import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBkNwIA9dnfOCcsnF_9VOZxun24IRCz_3Y",
  authDomain: "smart-attend-88a93.firebaseapp.com",
  projectId: "smart-attend-88a93",
  databaseURL: "https://smart-attend-88a93-default-rtdb.firebaseio.com",
  storageBucket: "smart-attend-88a93.firebasestorage.app",
  messagingSenderId: "50251675788",
  appId: "1:50251675788:web:3263f28113c81177a323a9",
  measurementId: "G-D4T5HBCMY9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const seedRTDB = async () => {
  try {
    console.log("Attempting to seed Realtime Database...");

    // Seed students
    await set(ref(db, 'students/23CSE0001'), {
      name: "Ravi Kumar",
      department: "CSE",
      section: "CSE-A",
      faceRegistered: true
    });

    await set(ref(db, 'students/23CSE0002'), {
      name: "Priya Sharma",
      department: "CSE",
      section: "CSE-A",
      faceRegistered: false
    });

    // Seed faculty
    await set(ref(db, 'faculty/EMP-CS01'), {
      name: "Dr. Suresh Rao",
      department: "CSE",
      role: "faculty"
    });

    // Seed admin
    await set(ref(db, 'admins/KONANGIGOPI'), {
      name: "KONANGI GOPI",
      role: "admin"
    });

    console.log("Successfully seeded Realtime Database! ✅");
    process.exit(0);
  } catch (error) {
    console.error("Failed to write to Realtime Database. Error:", error.message);
    process.exit(1);
  }
};

seedRTDB();
