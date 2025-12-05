// apply-sitin.js
import { db } from "./firebase.js";
import { ref, get, set, push } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ---------- Helpers ----------

// convert "HH:MM" to minutes
function toMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// basic time overlap check
function isOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

// random 8-digit code
function generateCode() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

// does a schedule with given "days" string apply on "today"?
// supports patterns like: "MWF", "TTH", "Mon", "Tue", "Fri", "Daily", etc.
function doesScheduleApplyToday(daysStr, todayShort) {
  if (!daysStr) {
    // if no days are stored, assume it applies every day (old behavior)
    return true;
  }

  const s = daysStr.toLowerCase().replace(/\s+/g, "");
  const d = todayShort.toLowerCase(); // e.g. "mon","tue","wed","thu","fri","sat","sun"

  // common patterns
  if (s.includes("daily")) return true;

  if (s.includes("mwf")) {
    return d === "mon" || d === "wed" || d === "fri";
  }

  if (s.includes("tth")) {
    return d === "tue" || d === "thu";
  }

  // single-day shortcuts (more flexible)
  if (d === "mon" && (s.includes("mon") || s === "m")) return true;
  if (d === "tue" && (s.includes("tue") || s === "t")) return true;
  if (d === "wed" && (s.includes("wed") || s === "w")) return true;
  if (d === "thu" && (s.includes("thu") || s === "th")) return true;
  if (d === "fri" && (s.includes("fri") || s === "f")) return true;
  if (d === "sat" && s.includes("sat")) return true;
  if (d === "sun" && s.includes("sun")) return true;

  return false;
}

// ---------- Form submission ----------

document.getElementById("sitinForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const year = document.getElementById("year").value;
  const room = document.getElementById("room").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const purpose = document.getElementById("purpose").value.trim();

  // today's weekday in PH time, e.g. "Mon"
  const todayShort = new Date().toLocaleDateString("en-PH", {
    weekday: "short",
    timeZone: "Asia/Manila"
  });

  // load schedules from DB
  const scheduleSnap = await get(ref(db, "schedules"));
  const schedules = scheduleSnap.val() ? Object.values(scheduleSnap.val()) : [];

  const sitStart = toMinutes(startTime);
  const sitEnd = toMinutes(endTime);

  for (const s of schedules) {
    if (s.room !== room) continue;

    // try to get the schedule's day field (adjust if your key is different)
    const scheduleDays = s.days || s.day || s.scheduleDays || "";

    // 🔑 only consider schedules that actually run today
    if (!doesScheduleApplyToday(scheduleDays, todayShort)) {
      continue;
    }

    const schedStart = toMinutes(s.start); // assuming schedule uses "start"
    const schedEnd = toMinutes(s.end);     // and "end"

    if (isOverlap(sitStart, sitEnd, schedStart, schedEnd)) {
      alert("❌ Room is NOT available during that time for today's schedule.");
      return;
    }
  }

  // no conflict -> approve sit-in
  const code = generateCode();
  const date = new Date().toLocaleDateString("en-PH", { timeZone: "Asia/Manila" });

  const sitinRef = push(ref(db, "sitins"));
  await set(sitinRef, { code, name, year, room, startTime, endTime, purpose, date });

  alert(`✅ Sit-in approved!\nYour code: ${code}`);
  e.target.reset();
});
