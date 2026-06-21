const admin = require("firebase-admin");

// 1. Point to your downloaded Service Account Key
const serviceAccount = require("./serviceAccountKey.json");

// 2. Initialize Firebase with the Realtime Database URL
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smart-attend-88a93-default-rtdb.firebaseio.com"
});

const db = admin.database();

async function seedDatabase() {
  console.log("Attempting to seed Realtime Database...");
  
  try {
    const studentsRef = db.ref('students');
    const facultyRef = db.ref('faculty');

    // Add some sample students
    await studentsRef.child('23CSE0001').set({
      name: "Ravi Kumar",
      department: "CSE",
      section: "CSE-A",
      faceRegistered: true
    });
    
    await studentsRef.child('23CSE0002').set({
      name: "Priya Sharma",
      department: "CSE",
      section: "CSE-A",
      faceRegistered: false
    });

    // Add some sample faculty
    await facultyRef.child('EMP-CS01').set({
      name: "Dr. Suresh Rao",
      department: "CSE",
      role: "faculty"
    });

    console.log("Successfully seeded Realtime Database! ✅");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Realtime Database:", error);
    process.exit(1);
  }
}

seedDatabase();
