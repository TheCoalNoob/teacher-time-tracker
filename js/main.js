// main.js
import { db } from "./firebase.js";
import { ref, set, get, push, remove, onValue } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Convert time to minutes
export function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Check time overlap
export function isOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

// Generate unique code
export function generateCode() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

// Save schedule
export function saveSchedule(schedule) {
  const scheduleRef = push(ref(db, "schedules"));
  return set(scheduleRef, schedule);
}

// Fetch schedules with callback
export function getSchedules(callback) {
  const scheduleRef = ref(db, "schedules");
  onValue(scheduleRef, (snapshot) => {
    const val = snapshot.val() || {};
    const list = Object.entries(val).map(([id, data]) => ({ id, ...data }));
    callback(list);
  });
}

// Delete schedule
export function deleteSchedule(id) {
  return remove(ref(db, `schedules/${id}`));
}
