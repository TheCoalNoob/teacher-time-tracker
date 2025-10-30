import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// --- Firebase Config ---
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Utility functions
function toMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function isOverlap(s1, e1, s2, e2) {
  return s1 < e2 && e1 > s2;
}

function generateCode() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

// Submit sit-in form
document.getElementById("sitinForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const year = document.getElementById("year").value;
  const room = document.getElementById("room").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const purpose = document.getElementById("purpose").value;

  const schedulesSnap = await get(ref(db, "schedules"));
  const schedules = schedulesSnap.val() ? Object.values(schedulesSnap.val()) : [];

  let available = true;
  for (let s of schedules) {
    if (s.room === room) {
      if (isOverlap(toMinutes(startTime), toMinutes(endTime), toMinutes(s.start), toMinutes(s.end))) {
        available = false;
        break;
      }
    }
  }

  if (!available) {
    alert("❌ Room not available at that time.");
    return;
  }

  const code = generateCode();
  const date = new Date().toLocaleDateString("en-PH", { timeZone: "Asia/Manila" });
  const sitinRef = ref(db, "sitins");
  const newSitIn = push(sitinRef);
  await set(newSitIn, { code, name, year, room, startTime, endTime, purpose, date });

  alert(`✅ Approved! Sit-in Code: ${code}`);
  e.target.reset();
});

