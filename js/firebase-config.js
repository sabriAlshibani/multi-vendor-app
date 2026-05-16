import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBJKqK6fLcEXgOs84v5CH2SGVzt49I9X2A",
    authDomain: "multi-vendor-app-68fed.firebaseapp.com",
    projectId: "multi-vendor-app-68fed",
    storageBucket: "multi-vendor-app-68fed.firebasestorage.app",
    messagingSenderId: "29626790500",
    appId: "1:29626790500:web:ae02d529f291abe8582571"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);