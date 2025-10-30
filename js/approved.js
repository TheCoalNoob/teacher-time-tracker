import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const presentTable = document.querySelector("#presentTable tbody");
const pastTable = document.querySelector("#pastTable tbody");

onValue(ref(db, "sitins"), (snapshot) => {
  const data = snapshot.val() || {};
  const sitins = Object.values(data);
  presentTable.innerHTML = "";
  pastTable.innerHTML = "";

  const today = new Date().toLocaleDateString("en-PH", { timeZone: "Asia/Manila" });

  sitins.forEach((s) => {
    const row = document.createElement("tr");
    const rowHTML = `
      <td><b>${s.code}</b></td>
      <td>${s.name}</td>
      <td>${s.year}</td>
      <td>${s.room}</td>
      <td>${s.startTime}</td>
      <td>${s.endTime}</td>
      <td>${s.purpose}</td>
      ${s.date !== today ? `<td>${s.date}</td>` : ""}
    `;
    row.innerHTML = rowHTML;

    if (s.date === today) {
      presentTable.appendChild(row);
    } else {
      pastTable.appendChild(row);
    }
  });
});
