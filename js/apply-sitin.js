// apply-sitin.js
import { db } from "./firebase.js";
import { ref, get, set, push } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Helper functions reused from main.js
function toMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function isOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

function generateCode() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

// Form submission
document.getElementById("sitinForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const year = document.getElementById("year").value;
  const room = document.getElementById("room").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const purpose = document.getElementById("purpose").value.trim();

  // Load schedule conflicts
  const scheduleSnap = await get(ref(db, "schedules"));
  const schedules = scheduleSnap.val() ? Object.values(scheduleSnap.val()) : [];

  for (const s of schedules) {
    if (s.room === room) {
      const start1 = toMinutes(startTime);
      const end1 = toMinutes(endTime);
      const start2 = toMinutes(s.start);
      const end2 = toMinutes(s.end);

      if (isOverlap(start1, end1, start2, end2)) {
        alert("❌ Room is NOT available during that time.");
        return;
      }
    }
  }

  // Create sit-in entry
  const code = generateCode();
  const date = new Date().toLocaleDateString("en-PH", { timeZone: "Asia/Manila" });

  const sitinRef = push(ref(db, "sitins"));
  await set(sitinRef, { code, name, year, room, startTime, endTime, purpose, date });

  alert(`✅ Sit-in approved!\nYour code: ${code}`);
  e.target.reset();
});
