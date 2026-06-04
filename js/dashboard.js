import { db } from "./firebase-config.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
// sliders
const CLOUD_NAME = "dcob7ysja";
const UPLOAD_PRESET = "multi-vendor-images";

const sliderForm = document.getElementById("slider_form");

async function uploadImage() {
  const sliderImage = document.getElementById("slider_image");
  try {
    const file = sliderImage.files[0];
    console.log(file);
    if (!file) {
      console.log("select image");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
    const data = await response.json();
    const imageUrl = data.secure_url;
    console.log(imageUrl);
    return imageUrl;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// sliderForm.onsubmit = async (e) => {
//   e.preventDefault();
//   const sliderTitle1 = document.getElementById("slider_title1").value;
//   const sliderTitle2 = document.getElementById("slider_title2").value;
//   const sliderDescription = document.getElementById("slider_description").value;
//   const sliderLink = document.getElementById("slider_link").value;
//   const sliderImagePreview = document.getElementById("slider_image_preview");
//   const imageUrl = await uploadImage();
//   if (
//     imageUrl !== null &&
//     sliderTitle1 !== "" &&
//     (sliderTitle2 !== "") & (sliderDescription !== "")
//   ) {
//     addDoc(collection(db, "sliders"), {
//       title1: sliderTitle1,
//       title2: sliderTitle2,
//       description: sliderDescription,
//       link: sliderLink,
//       imageUrl: imageUrl,
//       create_at: Date.now(),
//     });
//   }

//   console.log("image url", imageUrl);
// };
const dashboardMain = document.querySelector(".dash-main");

function navigateDashboard() {
  const navigationItems = document.querySelectorAll(".aside-item");
  navigationItems.forEach((item) => {
    item.onclick = function () {
      const linkKey = this.dataset.key;
      console.log(linkKey);
      navigationItems.forEach((i) => {
        i.classList.remove("aside-item-focused");
      });
      item.classList.add("aside-item-focused");

      switch (linkKey) {
        case "home": {
        }
        case "users": {
        }
        case "markets": {
        }
        case "products": {
        }
        case "banners": {
          showBannersContent();
        }
        case "categories": {
        }
        case "reports": {
        }
        case "orders": {
        }
        case "rating": {
        }
        default: {
        }
      }
    };
  });
}
navigateDashboard();

function showBannersContent() {
  const template = document.getElementById("banners-template");
  const clone = template.cloneNode(true);
  const sliderForm = clone.getElementById("slider_form");
  const title1 = clone.getElementById("slider_title1");
  const title2 = clone.getElementById("slider_title2");
  const sliderDescription = clone.getElementById("slider_description");
  const imageBox = clone.querySelector(".image-box");
  const sliderImage = clone.getElementById("slider_image");
  const imagePreview = clone.getElementById("slider_image_preview");
  const uploadIcon = clone.querySelector(".upload-icon");
  uploadBannerImage(imageBox, sliderImage, imagePreview, uploadIcon);
}

function uploadBannerImage(imageBox, sliderImage, imagePreview, uploadIcon) {
  if (imageBox && sliderImage) {
    imageBox.onclick = () => {
      sliderImage.click();
    };
  }
  sliderImage.onchange = (envent) => {
    const file = envent.target.files[0];
    if (!file) {
      return;
    }
    const url = URL.createObjectURL(file);
    imagePreview.src = url;
    console.log(url);
    uploadIcon.classList.add("hidden");
    console.log(uploadIcon);
  };
}

console.log(navigator.onLine)

function exitDashboard() {
  const exitBtn = document.querySelector(".exit-btn")
  exitBtn.onclick = () => {
    window.location.pathname = "index.html"
  }
}
exitDashboard()