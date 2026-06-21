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

const departments = ['CSE', 'ECE', 'MECH', 'EEE'];
const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Karthik', 'Divya', 'Suresh', 'Anjali', 'Vikram', 'Pooja', 'Ravi', 'Neha', 'Kiran', 'Swati', 'Arjun', 'Meera'];
const lastNames = ['Kumar', 'Sharma', 'Verma', 'Reddy', 'Patel', 'Singh', 'Gupta', 'Rao', 'Menon', 'Desai'];

function generateName() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
}

const seedRTDB = async () => {
  try {
    console.log("Generating massive dataset...");
    const studentsData = {};
    const facultyData = {};

    // Generate 500 Students
    for (let i = 1; i <= 500; i++) {
      const yearPrefix = 26 - Math.floor((i - 1) / 125); // 26, 25, 24, 23
      const dept = departments[i % 4];
      const rollNo = `${yearPrefix}${dept}${String(i).padStart(4, '0')}`;
      
      studentsData[rollNo] = {
        name: generateName(),
        department: dept,
        section: `${dept}-${i % 2 === 0 ? 'A' : 'B'}`,
        year: yearPrefix === 26 ? '1st Year' : yearPrefix === 25 ? '2nd Year' : yearPrefix === 24 ? '3rd Year' : '4th Year',
        faceRegistered: Math.random() > 0.3,
        email: `${rollNo.toLowerCase()}@smartattend.edu.in`
      };
    }

    // Generate 50 Faculty
    for (let i = 1; i <= 50; i++) {
      const dept = departments[i % 4];
      const empId = `EMP-${dept}${String(i).padStart(3, '0')}`;
      
      facultyData[empId] = {
        name: `Dr. ${generateName()}`,
        department: dept,
        role: "faculty",
        email: `${empId.toLowerCase()}@smartattend.edu.in`
      };
    }

    console.log("Attempting to push to Realtime Database...");

    // Push all students in one batch
    await set(ref(db, 'students'), studentsData);
    
    // Push all faculty in one batch
    await set(ref(db, 'faculty'), facultyData);

    // Ensure Admin exists
    await set(ref(db, 'admins/KONANGIGOPI'), {
      name: "KONANGI GOPI",
      role: "admin"
    });

    console.log("Successfully seeded 500 Students and 50 Faculty to Realtime Database! ✅");
    process.exit(0);
  } catch (error) {
    console.error("Failed to write to Realtime Database. Error:", error.message);
    process.exit(1);
  }
};

seedRTDB();
