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

sliderForm.onsubmit = async (e) => {
  e.preventDefault();
  const sliderTitle1 = document.getElementById("slider_title1").value;
  const sliderTitle2 = document.getElementById("slider_title2").value;
  const sliderDescription = document.getElementById("slider_description").value;
  const sliderLink = document.getElementById("slider_link").value;
  const sliderImagePreview = document.getElementById("slider_image_preview");
  const imageUrl = await uploadImage();
  if (
    imageUrl !== null &&
    sliderTitle1 !== "" &&
    (sliderTitle2 !== "") & (sliderDescription !== "")
  ) {
    addDoc(collection(db, "sliders"), {
      title1: sliderTitle1,
      title2: sliderTitle2,
      description: sliderDescription,
      link: sliderLink,
      imageUrl: imageUrl,
      create_at: Date.now(),
    });
  }

  console.log("image url", imageUrl);
};
