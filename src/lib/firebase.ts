import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

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

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);
