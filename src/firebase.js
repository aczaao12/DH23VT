// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Add your own Firebase configuration from your Firebase project settings
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBmXHDfx-2_-Jc3hXpGppjS0ciplvwyZ0",
  authDomain: "dh23vt-d086a.firebaseapp.com",
  databaseURL: "https://dh23vt-d086a-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "dh23vt-d086a",
  storageBucket: "dh23vt-d086a.firebasestorage.app",
  messagingSenderId: "963314060185",
  appId: "1:963314060185:web:9709ad8237d2b2557b6108",
  measurementId: "G-FRBQS1N0C7"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
// Force reload