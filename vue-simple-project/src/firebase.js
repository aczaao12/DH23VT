import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBmXHDfx-2_-Jc3hXpGppjS0ciplvwyZ0",
  authDomain: "dh23vt-d086a.firebaseapp.com",
  projectId: "dh23vt-d086a",
  storageBucket: "dh23vt-d086a.firebasestorage.app",
  messagingSenderId: "963314060185",
  appId: "1:963314060185:web:9709ad8237d2b2557b6108",
  measurementId: "G-FRBQS1N0C7"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các service
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };