// firebase.js
// Centralized Firebase initialization for all modules

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlvjVIdmYgMTD21ewiPUzWySFZrW9r5zs",
  authDomain: "teachertimetracker.firebaseapp.com",
  databaseURL: "https://teachertimetracker-default-rtdb.firebaseio.com",
  projectId: "teachertimetracker",
  storageBucket: "teachertimetracker.firebasestorage.app",
  messagingSenderId: "313570985747",
  appId: "1:313570985747:web:97c492e70cf636bc55fce6",
  measurementId: "G-1G04QPE4WE"
};

// Initialize ONCE and export db
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
