// approved.js
import { db } from "./firebase.js";
import { ref, onValue } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const presentTable = document.querySelector("#presentTable tbody");
const pastTable = document.querySelector("#pastTable tbody");
const loadingMsg = document.getElementById("loadingMsg");

onValue(ref(db, "sitins"), (snapshot) => {
  const data = snapshot.val() || {};
  const sitins = Object.values(data);

  presentTable.innerHTML = "";
  pastTable.innerHTML = "";

  const today = new Date().toLocaleDateString("en-PH", {
    timeZone: "Asia/Manila"
  });

  sitins.forEach((s) => {
    const row = document.createElement("tr");

    const html = `
      <td><b>${s.code}</b></td>
      <td>${s.name}</td>
      <td>${s.year}</td>
      <td>${s.room}</td>
      <td>${s.startTime}</td>
      <td>${s.endTime}</td>
      <td>${s.purpose}</td>
      ${s.date !== today ? `<td>${s.date}</td>` : ""}
    `;

    row.innerHTML = html;

    if (s.date === today) presentTable.appendChild(row);
    else pastTable.appendChild(row);
  });

  loadingMsg.style.display = "none";
});
