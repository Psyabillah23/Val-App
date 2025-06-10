// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";       // Tambahkan import Auth
import { getFirestore } from "firebase/firestore"; // Tambahkan import Firestore

const firebaseConfig = {

  apiKey: "AIzaSyD6509wS5Rd2fxwt5w9QCL61BbVLrqdzZE",
  authDomain: "psyabillah23-2196e.firebaseapp.com",
  projectId: "psyabillah23-2196e",
  storageBucket: "psyabillah23-2196e.firebasestorage.app",
  messagingSenderId: "855532642805",
  appId: "1:855532642805:web:b46bb03d7141944dc1c0bc",
  measurementId: "G-SCH4W8DDHT"
};


// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
