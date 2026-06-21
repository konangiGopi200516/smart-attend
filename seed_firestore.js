import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkNwIA9dnfOCcsnF_9VOZxun24IRCz_3Y",
  authDomain: "smart-attend-88a93.firebaseapp.com",
  projectId: "smart-attend-88a93",
  storageBucket: "smart-attend-88a93.firebasestorage.app",
  messagingSenderId: "50251675788",
  appId: "1:50251675788:web:3263f28113c81177a323a9",
  measurementId: "G-D4T5HBCMY9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedFirestore = async () => {
  try {
    console.log("Attempting to seed Firestore...");

    // Add a single test student
    const studentRef = doc(db, "students", "23CSE0001");
    await setDoc(studentRef, {
      rollNo: "23CSE0001",
      name: "Ravi Kumar",
      year: "4th Year",
      department: "CSE",
      section: "CSE-A",
      phone: "+91 98765 43210",
      village: "Ramachandrapuram",
      district: "East Godavari",
      state: "Andhra Pradesh",
      pincode: "533255",
      interCollege: "Narayana Junior College",
      interPercentage: "96.4%",
      schoolName: "Z.P. High School",
      schoolPercentage: "9.8 GPA",
      bloodGroup: "O+",
      dob: "15 Aug 2005",
      faceRegistered: false
    });

    console.log("Successfully wrote test student to Firestore!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to write to Firestore. Error:", error.message);
    process.exit(1);
  }
};

seedFirestore();
