// === SHARED DATA HANDLER ===

// Get or init schedules
function getSchedules() {
  return JSON.parse(localStorage.getItem("schedules") || "[]");
}

function saveSchedules(data) {
  localStorage.setItem("schedules", JSON.stringify(data));
}

// Get or init sit-ins
function getSitins() {
  return JSON.parse(localStorage.getItem("sitins") || "[]");
}

function saveSitins(data) {
  localStorage.setItem("sitins", JSON.stringify(data));
}

// Generate unique 8-digit code
function generateCode() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

// Time overlap check
function isOverlap(start1, end1, start2, end2) {
  return (start1 < end2 && end1 > start2);
}

// Convert "HH:MM" to minutes for comparison
function toMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// Format date
function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleString("en-PH", { timeZone: "Asia/Manila" });
}

