function getSchedules() {
  return JSON.parse(localStorage.getItem("schedules") || "[]");
}
function saveSchedules(data) {
  localStorage.setItem("schedules", JSON.stringify(data));
}

function getSitins() {
  return JSON.parse(localStorage.getItem("sitins") || "[]");
}
function saveSitins(data) {
  localStorage.setItem("sitins", JSON.stringify(data));
}

function generateCode() {
  return Math.floor(10000000 + Math.random() * 90000000);
}
function isOverlap(s1, e1, s2, e2) {
  return s1 < e2 && e1 > s2;
}
function toMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
