import { app, db } from "./firebase-config.js";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("googleBtn");

const signOutBtn = document.getElementById("logout-btn");

async function handleGoogleLogin() {
  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      console.log(result.user)
      window.location.href = "index.html";
    }
    console.log("WRITE DONE");
    console.log("User Already Exists");
  } catch (error) {
    console.error("حدث خطأ أثناء الدخول:", error.message);

    alert("فشل تسجيل الدخول");
  }
}

if (loginBtn) {
  loginBtn.addEventListener("click", handleGoogleLogin);
}

async function handleLogout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error);
  }
}

if (signOutBtn) {
  signOutBtn.addEventListener("click", handleLogout);
}


async function handleEmailSignUp(event) {
  event.preventDefault();
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (result.user) {
      window.location.href = "index.html";
    }
  }
  catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  }
}
const formSection = document.querySelector("#login-form");
if (formSection) {
  formSection.addEventListener("submit", handleEmailSignUp);
}

