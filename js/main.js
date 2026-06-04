import { db } from "./firebase-config.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
const auth = getAuth();

const showLanguageMenu = () => {
  const lgButton = document.querySelector(".lg-button");
  const lgContent = document.querySelector(".lg-content");

  if (lgButton && lgContent) {
    lgButton.onclick = () => {
      lgContent.classList.toggle("hidden");
    };
  }
};

const showMoneyMenu = () => {
  const mButton = document.querySelector(".m-button");
  const mContent = document.querySelector(".m-content");

  if (mButton && mContent) {
    mButton.onclick = () => {
      mContent.classList.toggle("hidden");
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
const accountIcon = document.querySelector(".account img");
const showCategorySidebar = () => {
  const cateButton = document.querySelector(".cate-button");
  const categorySidebar = document.querySelector(".category-sidebar");

  if (cateButton && categorySidebar) {
    cateButton.addEventListener("click", () => {
      categorySidebar.classList.toggle("add-height");
    });
  }
};

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
    console.log(user);
    accountIcon.src = user.photoURL;
  } else {
    console.log("No user is signed in.");
  }
});

showLanguageMenu();
showMoneyMenu();
makeMidleNavSticky();
showCategorySidebar();

const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const track = document.querySelector(".slider-track");
const sliderDots = document.querySelector(".slider-dots");
const loaderContainer = document.querySelector("#loading-container");

let currentSlider = 0;

async function showSliders() {
  const querySnapshot = await getDocs(collection(db, "sliders"));
  track.classList.add("hidden");
  if (!navigator.onLine) {
    const onlineStatus = document.querySelector(".online-status")
    onlineStatus.classList.remove("hidden")
    loaderContainer.classList.add("hidden");
    return
  }
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const sliderContainer = document.createElement("div");
    sliderContainer.className = "slider";

    const rightContent = document.createElement("div");
    rightContent.className = "right-content";

    const leftImage = document.createElement("div");
    leftImage.className = "left-image";

    const title = document.createElement("h2");
    title.className = "title";

    title.innerHTML = `${data.title1}<br>${data.title2}`;

    const description = document.createElement("p");

    description.className = "description";

    description.innerText = data.description;

    const button = document.createElement("button");

    button.className = "get-order-btn";

    button.innerText = data.link;

    const image = document.createElement("img");

    image.src = data.imageUrl;

    rightContent.appendChild(title);
    rightContent.appendChild(description);
    rightContent.appendChild(button);

    leftImage.appendChild(image);

    sliderContainer.appendChild(rightContent);
    sliderContainer.appendChild(leftImage);

    track.appendChild(sliderContainer);
  });
  console.log(loaderContainer);
  loaderContainer.classList.add("hidden");
  track.classList.remove("hidden");
  prevBtn.classList.remove("hidden");
  nextBtn.classList.remove("hidden");
}

function createSliderDots(slides) {
  sliderDots.innerHTML = "";

  slides.forEach((_, index) => {
    const dot = document.createElement("div");

    dot.dataset.index = index;

    if (index === 0) {
      dot.classList.add("highlight");
    }

    sliderDots.appendChild(dot);
  });
}

function updateCurrentSlider(slides, sliderDotItems) {
  track.style.transform = `translateX(${currentSlider * 100}%)`;

  sliderDotItems.forEach((dot) => {
    dot.classList.remove("highlight");
  });

  sliderDotItems[currentSlider]?.classList.add("highlight");
}

async function initSlider() {
  await showSliders();

  const slides = document.querySelectorAll(".slider");

  createSliderDots(slides);

  const sliderDotItems = document.querySelectorAll(".slider-dots div");

  nextBtn?.addEventListener("click", () => {
    currentSlider++;

    if (currentSlider >= slides.length) {
      currentSlider = 0;
    }

    updateCurrentSlider(slides, sliderDotItems);
  });

  prevBtn?.addEventListener("click", () => {
    currentSlider--;

    if (currentSlider < 0) {
      currentSlider = slides.length - 1;
    }

    updateCurrentSlider(slides, sliderDotItems);
  });

  sliderDotItems.forEach((dot) => {
    dot.addEventListener("click", () => {
      currentSlider = Number(dot.dataset.index);

      updateCurrentSlider(slides, sliderDotItems);
    });
  });
}

initSlider();

function showUserAccount() {
  const accountIcon = document.querySelector(".account");
  const accountMenu = document.querySelector(".account-menu");
  console.log(accountIcon);
  console.log(accountMenu);
  if (accountIcon && accountMenu) {
    accountIcon.onclick = () => {
      accountMenu.classList.toggle("hidden");
    };
  }
}
showUserAccount();

const showMobileNavigation = () => {
  const hamburgerBtn = document.querySelector("#hamburger-btn");
  const navigation = document.querySelector(".nav .navigation");

  if (hamburgerBtn && navigation) {
    hamburgerBtn.addEventListener("click", () => {
      navigation.classList.toggle("active");
    });
  }
};
showMobileNavigation();
