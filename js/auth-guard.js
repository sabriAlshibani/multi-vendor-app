import {
  onAuthStateChanged,
  getAuth,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

import { db } from "./firebase-config.js";

const auth = getAuth();

onAuthStateChanged(auth, async (user) => {
  const currentPage = window.location.pathname;

  const isAuthPage =
    currentPage.includes("login.html") ||
    currentPage.includes("register.html");

  const isDashboardPage =
    currentPage.includes("dashboard.html");

  if (user) {

    if (isAuthPage) {
      window.location.href = "index.html";
      return;
    }

    await authorizeUser(user.uid, isDashboardPage);

  } else {
    if (!isAuthPage) {
      window.location.href = "login.html";
      return;
    }
  }
});

async function authorizeUser(userId, isDashboardPage) {
  const userRef = doc(db, "users", userId);

  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    window.location.href = "login.html";
    return;
  }

  const userDb = userSnap.data();
  const isAdmin = userDb.role === "admin";

  if (!isAdmin && isDashboardPage) {
    window.location.href = "index.html";
    return;
  }

  const topNav = document.querySelector(".top-nav .container");

  if (isAdmin && topNav) {
    const dashboardBtn = document.createElement("button");

    dashboardBtn.innerText = "لوحة التحكم";

    dashboardBtn.onclick = () => {
      window.location.href = "dashboard.html";
    };

    topNav.appendChild(dashboardBtn);
  }
}