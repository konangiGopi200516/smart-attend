import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBkNwIA9dnfOCcsnF_9VOZxun24IRCz_3Y",
  authDomain: "smart-attend-88a93.firebaseapp.com",
  databaseURL: "https://smart-attend-88a93-default-rtdb.firebaseio.com",
  projectId: "smart-attend-88a93",
  storageBucket: "smart-attend-88a93.firebasestorage.app",
  messagingSenderId: "50251675788",
  appId: "1:50251675788:web:3263f28113c81177a323a9",
  measurementId: "G-D4T5HBCMY9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const years = [
  { id: '1st Year', admissionYear: '26' },
  { id: '2nd Year', admissionYear: '25' },
  { id: '3rd Year', admissionYear: '24' },
  { id: '4th Year', admissionYear: '23' },
];

const departments = [
  { id: 'CSE', code: '01', secSize: 72, sections: 8 },
  { id: 'ECE', code: '02', secSize: 64, sections: 3 },
  { id: 'MECH', code: '03', secSize: 48, sections: 2 },
  { id: 'EEE', code: '04', secSize: 48, sections: 2 },
];

async function seed() {
  const students = {};

  for (const year of years) {
    for (const dept of departments) {
      const sectionLetters = 'ABCDEFGH'.split('');
      for (let s = 0; s < dept.sections; s++) {
        const sectionLetter = sectionLetters[s];
        const sectionId = `${dept.id}-${sectionLetter}`;
        
        const startNum = (s * dept.secSize) + 1;
        for (let i = 0; i < dept.secSize; i++) {
          const studentNum = startNum + i;
          const internalId = `${year.admissionYear}0003${dept.code}${String(studentNum).padStart(4, '0')}`;
          const displayRoll = `${year.admissionYear}${dept.id.substring(0,3)}${String(studentNum).padStart(4, '0')}`;

          students[internalId] = {
            id: internalId,
            displayRoll: displayRoll,
            name: ['Alice Smith', 'Bob Johnson', 'Charlie Brown', 'Diana Prince', 'Evan Wright', 'Fiona Gallagher', 'George Costanza', 'Hannah Abbott'][i % 8] + ` ${studentNum}`,
            year: year.id,
            department: dept.id,
            section: sectionId,
            attendance: Math.floor(Math.random() * 30) + 70,
            status: Math.random() > 0.85 ? 'Warning' : 'Active',
            scanStatus: 'pending'
          };
        }
      }
    }
  }

  console.log(`Writing ${Object.keys(students).length} students to Firebase...`);
  try {
    console.log("Attempting anonymous sign-in...");
    await signInAnonymously(auth);
    console.log("Signed in anonymously. Pushing data...");
    
    await set(ref(db, 'students'), students);
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

seed();
