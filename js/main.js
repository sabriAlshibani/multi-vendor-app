import { db } from "./firebase-config.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
const auth = getAuth();



const showLanguageMenu = () => {
  const lgButton = document.querySelector(".lg-button");
  const lgContent = document.querySelector(".lg-content");

  if (lgButton && lgContent) {
    lgButton.onclick = () => {
      lgContent.style.display =
        lgContent.style.display === "flex" ? "none" : "flex";
    };
  }
};


const showMoneyMenu = () => {
  const mButton = document.querySelector(".m-button");
  const mContent = document.querySelector(".m-content");

  if (mButton && mContent) {
    mButton.onclick = () => {
      mContent.style.display =
        mContent.style.display === "flex" ? "none" : "flex";
    };
  }
};


const makeMidleNavSticky = () => {
  const middNav = document.querySelector(".mid-nav");

  if (middNav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        middNav.classList.add("sticky-mid-nav");
      } else {
        middNav.classList.remove("sticky-mid-nav");
      }
    });
  }
};


const showCategorySidebar = () => {
  const cateButton = document.querySelector(".cate-button");
  const categorySidebar = document.querySelector(".category-sidebar");

  if (cateButton && categorySidebar) {
    cateButton.addEventListener("click", () => {
      categorySidebar.classList.toggle("add-height");
    });
  }
};



const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const track = document.querySelector(".slider-track");
const slides = document.querySelectorAll(".slider");
const sliderDots = document.querySelector(".slider-dots");

let currentSlider = 0;

const createSliderDots = () => {
  if (!sliderDots || !slides.length) return;
  for (let i = 0; i < slides.length; i++) {
    const div = document.createElement("div");
    div.dataset.index = i;
    if (i === 0) {
      div.classList.add("highlight");
    }
    sliderDots.appendChild(div);
  }
};

createSliderDots();

const sliderDotItems = document.querySelectorAll(".slider-dots div");

const updateCurrentSlider = () => {
  if (!track || !sliderDotItems.length) return;
  track.style.transform = `translateX(${currentSlider * 100}%)`;

  sliderDotItems.forEach((dot) => {
    dot.classList.remove("highlight");
  });

  if (sliderDotItems[currentSlider]) {
    sliderDotItems[currentSlider].classList.add("highlight");
  }
};

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    currentSlider++;
    if (currentSlider >= slides.length) {
      currentSlider = 0;
    }
    updateCurrentSlider();
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    currentSlider--;
    if (currentSlider < 0) {
      currentSlider = slides.length - 1;
    }
    updateCurrentSlider();
  });
}


const updateCurrentSliderByDots = () => {
  if (!sliderDotItems.length) return;
  sliderDotItems.forEach((e) => {
    e.onclick = () => {
      currentSlider = Number(e.dataset.index);
      updateCurrentSlider();
    };
  });
};

updateCurrentSliderByDots();
showLanguageMenu();
showMoneyMenu();
makeMidleNavSticky();
showCategorySidebar();

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || "User",
        email: user.email,
        image: user.photoURL || "",
        role: "user",
        createdAt: Date.now(),
      });
    }
  } else {
    console.log("No user is signed in.");
  }
});