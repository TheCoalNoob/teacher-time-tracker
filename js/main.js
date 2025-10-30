// --- Firebase Integration ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, get, push, remove, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- Utility functions ---

export function saveSchedule(data) {
  const schedulesRef = ref(db, "schedules");
  const newScheduleRef = push(schedulesRef);
  set(newScheduleRef, data);
}

export function getSchedules(callback) {
  const schedulesRef = ref(db, "schedules");
  onValue(schedulesRef, (snapshot) => {
    const data = snapshot.val() || {};
    const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
    callback(list);
  });
}

export function deleteSchedule(id) {
  remove(ref(db, `schedules/${id}`));
}

export function generateCode() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

export function isOverlap(s1, e1, s2, e2) {
  return s1 < e2 && e1 > s2;
}

export function toMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
