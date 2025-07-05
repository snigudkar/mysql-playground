import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "login-page-923f8.firebaseapp.com",
  databaseURL: "https://login-page-923f8-default-rtdb.firebaseio.com",
  projectId: "login-page-923f8",
  storageBucket: "login-page-923f8.firebasestorage.app",
  messagingSenderId: "784857233109",
  appId: "1:784857233109:web:594bb2dfe13780a0e4545c"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase services and export them
export const auth = getAuth(app);
export const db = getFirestore(app);