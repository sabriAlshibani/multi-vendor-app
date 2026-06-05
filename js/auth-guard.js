import {
  onAuthStateChanged,
  getAuth,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc
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

    await authorizeUser(user, isDashboardPage);

  } else {
    if (!isAuthPage) {
      window.location.href = "login.html";
      return;
    }
  }
});

async function authorizeUser(user, isDashboardPage) {
  const userRef = doc(db, "users", user.uid);

  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "User",
      email: user.email,
      image: user.photoURL || "",
      role: "user",
      phone: "",
      addresses: [],
      createdAt: Date.now(),
    });
    return;
  }

  const userDb = userSnap.data();
  const isAdmin = userDb.role === "admin";
  const isVendor = userDb.role === "vendor";

  if (!isAdmin && isDashboardPage) {
    window.location.href = "index.html";
    return;
  }


  if (isAdmin) {
    const dashboardBtn = document.getElementById("dashboard-btn");
    if (dashboardBtn) {
      dashboardBtn.classList.remove("hidden");
      dashboardBtn.onclick = () => {
        window.location.href = "dashboard.html";
      };
    }
  }
}

// Show modal for vendor user to create his vendor page
onAuthStateChanged(auth, async (user) => {
  const userRef = doc(db, "users", user.uid)
  const userSnap = await getDoc(userRef)
  if (user && userSnap.exists()) {
    const userDb = userSnap.data()
    if (userDb.role === "vendor" && !userDb.isVendorCreated) {
      await updateDoc(doc(db, "users", user.uid), {
        isVendorCreated: false
      })
      const vendorMessageModal = document.querySelector(".vendor-message-hidden")
      vendorMessageModal.classList.add("vendor-message-modal")
    }
  }
})

// protect "create vendor page"

onAuthStateChanged(auth, async (user) => {
  const currentPage = window.location.pathname;
  const isCreateVendorPage = currentPage.includes("create-vendor-page.html")
  if (isCreateVendorPage) {
    if (!user) {
      window.location.href = "login.html";
      return;
    }
    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)
    const userDb = userSnap.data()
    if (userDb.role !== "vendor" && userDb.role !== "admin") {
      window.location.href = "index.html";
      return;
    }
  }
})