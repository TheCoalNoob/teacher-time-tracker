// apply-sitin.js
import { db } from "./firebase.js";
import { ref, get, set, push }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const MAX_CAPACITY = 15;

// ---------- Helpers ----------
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

function getPHDate() {
  return new Date().toLocaleDateString("en-PH", { timeZone: "Asia/Manila" });
}

function getPHWeekdayShort() {
  return new Date().toLocaleDateString("en-PH", {
    weekday: "short",
    timeZone: "Asia/Manila",
  }); // "Mon", "Tue", ...
}

// supports: "MWF", "TTH", "Mon", "Tue", "Fri", "Daily", etc.
function doesScheduleApplyToday(daysStr, todayShort) {
  if (!daysStr) return true; // backward compatible: applies everyday if missing

  const s = String(daysStr).toLowerCase().replace(/\s+/g, "");
  const d = String(todayShort).toLowerCase();

  if (s.includes("daily")) return true;

  if (s.includes("mwf")) return d === "mon" || d === "wed" || d === "fri";
  if (s.includes("tth")) return d === "tue" || d === "thu";

  // single-day words
  if (d === "mon" && s.includes("mon")) return true;
  if (d === "tue" && (s.includes("tue") || s.includes("tues"))) return true;
  if (d === "wed" && s.includes("wed")) return true;
  if (d === "thu" && (s.includes("thu") || s.includes("thur") || s.includes("thurs"))) return true;
  if (d === "fri" && s.includes("fri")) return true;
  if (d === "sat" && s.includes("sat")) return true;
  if (d === "sun" && s.includes("sun")) return true;

  return false;
}

// ---------- Form submission ----------
document.getElementById("sitinForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const name = document.getElementById("name").value.trim();
    const year = document.getElementById("year").value.trim();
    const room = document.getElementById("room").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const purpose = document.getElementById("purpose").value.trim();

    if (!name || !year || !room || !startTime || !endTime || !purpose) {
      alert("Please complete all fields.");
      return;
    }

    const sitStart = toMinutes(startTime);
    const sitEnd = toMinutes(endTime);
    if (sitEnd <= sitStart) {
      alert("End time must be later than start time.");
      return;
    }

    const todayShort = getPHWeekdayShort();
    const todayDate = getPHDate();

    // 1) Teacher schedule conflicts (day-aware)
    const scheduleSnap = await get(ref(db, "schedules"));
    const schedulesObj = scheduleSnap.val() || {};
    const schedules = Object.values(schedulesObj);

    for (const s of schedules) {
      if (!s || s.room !== room) continue;

      const scheduleDays = s.days || s.day || s.scheduleDays || "";
      if (!doesScheduleApplyToday(scheduleDays, todayShort)) continue;

      // expect schedule fields: start, end
      if (!s.start || !s.end) continue;

      const schedStart = toMinutes(s.start);
      const schedEnd = toMinutes(s.end);

      if (isOverlap(sitStart, sitEnd, schedStart, schedEnd)) {
        alert("❌ Room is NOT available during that time for today's schedule.");
        return;
      }
    }

    // 2) Capacity limit: max 15 sit-ins per room for overlapping time TODAY
    const sitinsSnap = await get(ref(db, "sitins"));
    const sitinsObj = sitinsSnap.val() || {};
    const sitins = Object.values(sitinsObj);

    const overlappingSameRoomCount = sitins.reduce((count, x) => {
      if (!x) return count;
      if (x.room !== room) return count;
      if (x.date !== todayDate) return count;
      if (!x.startTime || !x.endTime) return count;

      const xStart = toMinutes(x.startTime);
      const xEnd = toMinutes(x.endTime);

      return isOverlap(sitStart, sitEnd, xStart, xEnd) ? count + 1 : count;
    }, 0);

    if (overlappingSameRoomCount >= MAX_CAPACITY) {
      alert(`The ${room} room is occupied on that time.`);
      return;
    }

    // 3) Save approved sit-in
    const code = generateCode();
    const sitinRef = push(ref(db, "sitins"));

    await set(sitinRef, {
      code,
      name,
      year,
      room,
      startTime,
      endTime,
      purpose,
      date: todayDate,
    });

    // If you have window.showToast() in HTML, use it; else fallback to alert
    if (typeof window.showToast === "function") {
      window.showToast(`✅ Approved! Sit-in Code: ${code}`);
    } else {
      alert(`✅ Approved! Sit-in Code: ${code}`);
    }

    e.target.reset();
  } catch (err) {
    console.error(err);
    alert("Submission failed. Please check your internet or Firebase rules.");
  }
});
