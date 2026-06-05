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
  getDocs,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
// sliders
const CLOUD_NAME = "dcob7ysja";
const UPLOAD_PRESET = "multi-vendor-images";

const sliderForm = document.getElementById("slider_form");

async function uploadImage(file) {
  try {
    if (!file) {
      console.log("select image");
      return null;
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



// Manipulation dashbaord
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
          showUsersContent()
        }
        case "markets": {
          showMarketsContent();
          break;
        }
        case "products": {
          showProductsContent();
          break;
        }
        case "banners": {
          showBannersContent();
          break;
        }
        case "categories": {
          showCategoriesContent();
          break;
        }
        case "reports": {
        }
        case "orders": {
          showOrdersContent();
          break;
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

async function showBannersContent() {
  const template = document.getElementById("banners-template");
  const clone = template.content.cloneNode(true);
  const sliderForm = clone.querySelector("#slider_form");
  const title1 = clone.querySelector("#slider_title1");
  const title2 = clone.querySelector("#slider_title2");
  const sliderDescription = clone.querySelector("#slider_description");
  const sliderLink = clone.querySelector("#slider_link");
  const imageBox = clone.querySelector(".image-box");
  const sliderImage = clone.querySelector("#slider_image");
  const imagePreview = clone.querySelector("#slider_image_preview");
  const uploadIcon = clone.querySelector(".upload-icon");
  const bannersTableBody = clone.querySelector("#banners-table-body");
  
  uploadBannerImage(imageBox, sliderImage, imagePreview, uploadIcon);
  
  sliderForm.onsubmit = async (e) => {
    e.preventDefault();
    const submitBtn = sliderForm.querySelector("button[type='submit']");
    submitBtn.textContent = "جاري الرفع...";
    submitBtn.disabled = true;

    const file = sliderImage.files[0];
    const imageUrl = await uploadImage(file);
    
    if (imageUrl !== null && title1.value !== "" && title2.value !== "" && sliderDescription.value !== "") {
      try {
        await addDoc(collection(db, "sliders"), {
          title1: title1.value,
          title2: title2.value,
          description: sliderDescription.value,
          link: sliderLink ? sliderLink.value : "",
          imageUrl: imageUrl,
          create_at: Date.now(),
        });
        alert("تمت الإضافة بنجاح!");
        showBannersContent(); // Refresh to show new banner
      } catch (error) {
        console.error("Error adding document: ", error);
        alert("حدث خطأ أثناء الإضافة.");
        submitBtn.textContent = "انشاء";
        submitBtn.disabled = false;
      }
    } else {
      alert("الرجاء ملء جميع الحقول واختيار صورة.");
      submitBtn.textContent = "انشاء";
      submitBtn.disabled = false;
    }
  };

  dashboardMain.innerHTML = "";
  dashboardMain.appendChild(clone);
  
  // Fetch existing banners
  try {
    const tbody = document.getElementById("banners-table-body");
    const slidersSnap = await getDocs(collection(db, "sliders"));
    tbody.innerHTML = "";
    
    slidersSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const tr = document.createElement("tr");
      
      const imgTd = document.createElement("td");
      const img = document.createElement("img");
      img.src = data.imageUrl;
      img.style.width = "80px";
      img.style.height = "50px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "8px";
      imgTd.appendChild(img);
      
      const titleTd = document.createElement("td");
      titleTd.innerHTML = `<strong>${data.title1}</strong><br><small>${data.title2}</small>`;
      
      const descTd = document.createElement("td");
      descTd.textContent = data.description ? (data.description.substring(0, 30) + "...") : "";
      
      const linkTd = document.createElement("td");
      linkTd.textContent = data.link || "لا يوجد";
      
      const actionTd = document.createElement("td");
      const delBtn = document.createElement("button");
      delBtn.textContent = "حذف";
      delBtn.classList.add("action-btn", "remove-vendor");
      delBtn.onclick = async () => {
        if(confirm("هل أنت متأكد من حذف هذا البانر؟")) {
          try {
            await deleteDoc(doc(db, "sliders", docSnap.id));
            showBannersContent();
          } catch(err) {
             console.error(err);
             alert("حدث خطأ أثناء الحذف");
          }
        }
      };
      actionTd.appendChild(delBtn);
      
      tr.appendChild(imgTd);
      tr.appendChild(titleTd);
      tr.appendChild(descTd);
      tr.appendChild(linkTd);
      tr.appendChild(actionTd);
      
      tbody.appendChild(tr);
    });
    
  } catch (err) {
    console.error(err);
  }
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

// Orders
async function showOrdersContent() {
  const template = document.getElementById("orders-template");
  const clone = template.content.cloneNode(true);
  const tableBody = clone.querySelector("#orders-table-body");

  dashboardMain.innerHTML = "";
  dashboardMain.appendChild(clone);

  try {
    const ordersSnap = await getDocs(collection(db, "orders"));
    tableBody.innerHTML = "";

    ordersSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const tr = document.createElement("tr");

      const idTd = document.createElement("td");
      idTd.textContent = docSnap.id.substring(0, 8).toUpperCase();
      idTd.style.fontWeight = "600";

      const customerTd = document.createElement("td");
      customerTd.textContent = data.customerEmail || "عميل غير معروف";

      const amountTd = document.createElement("td");
      amountTd.textContent = (data.totalAmount || 0) + " ريال";

      const statusTd = document.createElement("td");
      const statusSpan = document.createElement("span");
      statusSpan.classList.add("badge-role");
      
      if (data.status === "delivered") {
        statusSpan.classList.add("badge-admin"); // Using admin style (blue) for delivered
        statusSpan.textContent = "تم التوصيل";
      } else if (data.status === "shipped") {
        statusSpan.classList.add("badge-vendor"); // Using vendor style (gold) for shipped
        statusSpan.textContent = "تم الشحن";
      } else {
        statusSpan.classList.add("badge-user"); // Using user style (gray) for pending
        statusSpan.textContent = "قيد المعالجة";
      }
      statusTd.appendChild(statusSpan);

      const actionTd = document.createElement("td");
      const statusSelect = document.createElement("select");
      statusSelect.style.padding = "5px";
      statusSelect.style.borderRadius = "4px";
      
      const pendingOpt = document.createElement("option");
      pendingOpt.value = "pending";
      pendingOpt.textContent = "قيد المعالجة";
      const shippedOpt = document.createElement("option");
      shippedOpt.value = "shipped";
      shippedOpt.textContent = "تم الشحن";
      const deliveredOpt = document.createElement("option");
      deliveredOpt.value = "delivered";
      deliveredOpt.textContent = "تم التوصيل";

      statusSelect.appendChild(pendingOpt);
      statusSelect.appendChild(shippedOpt);
      statusSelect.appendChild(deliveredOpt);

      statusSelect.value = data.status || "pending";

      statusSelect.onchange = async (e) => {
        const newStatus = e.target.value;
        try {
          await updateDoc(doc(db, "orders", docSnap.id), {
            status: newStatus
          });
          showOrdersContent();
        } catch (error) {
          console.error("Error updating order status:", error);
          alert("حدث خطأ أثناء تغيير حالة الطلب");
        }
      };

      actionTd.appendChild(statusSelect);

      tr.appendChild(idTd);
      tr.appendChild(customerTd);
      tr.appendChild(amountTd);
      tr.appendChild(statusTd);
      tr.appendChild(actionTd);

      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    tableBody.innerHTML = "<tr><td colspan='5' style='text-align: center;'>حدث خطأ في جلب الطلبات أو لا توجد طلبات بعد</td></tr>";
  }
}

// Markets (Vendors)
async function showMarketsContent() {
  const template = document.getElementById("markets-template");
  const clone = template.content.cloneNode(true);
  const tableBody = clone.querySelector("#markets-table-body");

  dashboardMain.innerHTML = "";
  dashboardMain.appendChild(clone);

  try {
    const usersSnap = await getDocs(collection(db, "users"));
    tableBody.innerHTML = "";

    usersSnap.forEach((userDoc) => {
      const userData = userDoc.data();
      
      // Only show vendors
      if (userData.role !== "vendor") return;

      const tr = document.createElement("tr");

      const nameTd = document.createElement("td");
      nameTd.textContent = userData.name || "بائع بدون اسم";
      nameTd.style.fontWeight = "600";

      const emailTd = document.createElement("td");
      emailTd.textContent = userData.email || "بدون إيميل";

      const statusTd = document.createElement("td");
      const statusSpan = document.createElement("span");
      statusSpan.classList.add("badge-role", "badge-vendor");
      statusSpan.textContent = "معتمد";
      statusTd.appendChild(statusSpan);

      const actionTd = document.createElement("td");
      const revokeBtn = document.createElement("button");
      revokeBtn.classList.add("action-btn", "remove-vendor");
      revokeBtn.textContent = "إلغاء الصلاحية";
      
      revokeBtn.onclick = async () => {
        if (confirm("هل أنت متأكد من إلغاء صلاحية البائع لهذا المستخدم؟")) {
          try {
            await updateDoc(doc(db, "users", userData.uid), {
              role: "user"
            });
            showMarketsContent(); // refresh
          } catch (error) {
            console.error("Error updating role:", error);
            alert("حدث خطأ أثناء تعديل الصلاحية");
          }
        }
      };
      
      actionTd.appendChild(revokeBtn);

      tr.appendChild(nameTd);
      tr.appendChild(emailTd);
      tr.appendChild(statusTd);
      tr.appendChild(actionTd);

      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error fetching markets:", error);
    tableBody.innerHTML = "<tr><td colspan='4' style='text-align: center;'>حدث خطأ في جلب المتاجر</td></tr>";
  }
}

// Products
async function showProductsContent() {
  const template = document.getElementById("products-template");
  const clone = template.content.cloneNode(true);
  
  const productForm = clone.querySelector("#product_form");
  const productName = clone.querySelector("#product_name");
  const productPrice = clone.querySelector("#product_price");
  const productCategory = clone.querySelector("#product_category");
  const productDescription = clone.querySelector("#product_description");
  const productImage = clone.querySelector("#product_image");
  const imagePreview = clone.querySelector("#product_image_preview");
  const uploadIcon = clone.querySelector(".upload-icon");
  const imageBox = clone.querySelector(".image-box");
  const productsTableBody = clone.querySelector("#products-table-body");

  // Fetch categories for the dropdown
  try {
    const categoriesSnap = await getDocs(collection(db, "categories"));
    categoriesSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const option = document.createElement("option");
      option.value = data.name; // or docSnap.id
      option.textContent = data.name;
      productCategory.appendChild(option);
    });
  } catch (err) {
    console.error("Error fetching categories for dropdown: ", err);
  }

  uploadBannerImage(imageBox, productImage, imagePreview, uploadIcon);

  productForm.onsubmit = async (e) => {
    e.preventDefault();
    const submitBtn = productForm.querySelector("button[type='submit']");
    submitBtn.textContent = "جاري الإضافة...";
    submitBtn.disabled = true;

    const file = productImage.files[0];
    const imageUrl = await uploadImage(file);

    if (imageUrl !== null && productName.value !== "" && productPrice.value !== "" && productCategory.value !== "") {
      try {
        await addDoc(collection(db, "products"), {
          name: productName.value,
          price: Number(productPrice.value),
          category: productCategory.value,
          description: productDescription.value,
          imageUrl: imageUrl,
          create_at: Date.now(),
        });
        alert("تمت إضافة المنتج بنجاح!");
        showProductsContent(); // Refresh
      } catch (error) {
        console.error("Error adding product: ", error);
        alert("حدث خطأ أثناء إضافة المنتج.");
        submitBtn.textContent = "إضافة المنتج";
        submitBtn.disabled = false;
      }
    } else {
      alert("الرجاء ملء جميع الحقول واختيار صورة.");
      submitBtn.textContent = "إضافة المنتج";
      submitBtn.disabled = false;
    }
  };

  dashboardMain.innerHTML = "";
  dashboardMain.appendChild(clone);

  // Fetch existing products
  try {
    const tbody = document.getElementById("products-table-body");
    const productsSnap = await getDocs(collection(db, "products"));
    tbody.innerHTML = "";

    productsSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const tr = document.createElement("tr");

      const imgTd = document.createElement("td");
      const img = document.createElement("img");
      img.src = data.imageUrl;
      img.style.width = "60px";
      img.style.height = "60px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "8px";
      imgTd.appendChild(img);

      const nameTd = document.createElement("td");
      nameTd.textContent = data.name;
      nameTd.style.fontWeight = "600";

      const priceTd = document.createElement("td");
      priceTd.textContent = data.price + " ريال";

      const categoryTd = document.createElement("td");
      categoryTd.textContent = data.category;

      const actionTd = document.createElement("td");
      const delBtn = document.createElement("button");
      delBtn.textContent = "حذف";
      delBtn.classList.add("action-btn", "remove-vendor");
      delBtn.onclick = async () => {
        if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
          try {
            await deleteDoc(doc(db, "products", docSnap.id));
            showProductsContent();
          } catch (err) {
            console.error(err);
            alert("حدث خطأ أثناء الحذف");
          }
        }
      };
      actionTd.appendChild(delBtn);

      tr.appendChild(imgTd);
      tr.appendChild(nameTd);
      tr.appendChild(priceTd);
      tr.appendChild(categoryTd);
      tr.appendChild(actionTd);

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error fetching products: ", err);
  }
}

// Categories
async function showCategoriesContent() {
  const template = document.getElementById("categories-template");
  const clone = template.content.cloneNode(true);
  
  const categoryForm = clone.querySelector("#category_form");
  const categoryName = clone.querySelector("#category_name");
  const categoryImage = clone.querySelector("#category_image");
  const imagePreview = clone.querySelector("#category_image_preview");
  const uploadIcon = clone.querySelector(".upload-icon");
  const imageBox = clone.querySelector(".image-box");
  const categoriesTableBody = clone.querySelector("#categories-table-body");

  // Reusing uploadBannerImage for preview logic
  uploadBannerImage(imageBox, categoryImage, imagePreview, uploadIcon);

  categoryForm.onsubmit = async (e) => {
    e.preventDefault();
    const submitBtn = categoryForm.querySelector("button[type='submit']");
    submitBtn.textContent = "جاري الإضافة...";
    submitBtn.disabled = true;

    const file = categoryImage.files[0];
    const imageUrl = await uploadImage(file);

    if (imageUrl !== null && categoryName.value !== "") {
      try {
        await addDoc(collection(db, "categories"), {
          name: categoryName.value,
          imageUrl: imageUrl,
          create_at: Date.now(),
        });
        alert("تمت الإضافة بنجاح!");
        showCategoriesContent(); // Refresh
      } catch (error) {
        console.error("Error adding category: ", error);
        alert("حدث خطأ أثناء الإضافة.");
        submitBtn.textContent = "إضافة الصنف";
        submitBtn.disabled = false;
      }
    } else {
      alert("الرجاء إدخال اسم الصنف واختيار صورة.");
      submitBtn.textContent = "إضافة الصنف";
      submitBtn.disabled = false;
    }
  };

  dashboardMain.innerHTML = "";
  dashboardMain.appendChild(clone);

  // Fetch existing categories
  try {
    const tbody = document.getElementById("categories-table-body");
    const categoriesSnap = await getDocs(collection(db, "categories"));
    tbody.innerHTML = "";

    categoriesSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const tr = document.createElement("tr");

      const imgTd = document.createElement("td");
      const img = document.createElement("img");
      img.src = data.imageUrl;
      img.style.width = "60px";
      img.style.height = "60px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "8px";
      imgTd.appendChild(img);

      const nameTd = document.createElement("td");
      nameTd.textContent = data.name;
      nameTd.style.fontWeight = "600";

      const actionTd = document.createElement("td");
      const delBtn = document.createElement("button");
      delBtn.textContent = "حذف";
      delBtn.classList.add("action-btn", "remove-vendor");
      delBtn.onclick = async () => {
        if (confirm("هل أنت متأكد من حذف هذا الصنف؟")) {
          try {
            await deleteDoc(doc(db, "categories", docSnap.id));
            showCategoriesContent();
          } catch (err) {
            console.error(err);
            alert("حدث خطأ أثناء الحذف");
          }
        }
      };
      actionTd.appendChild(delBtn);

      tr.appendChild(imgTd);
      tr.appendChild(nameTd);
      tr.appendChild(actionTd);

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error fetching categories: ", err);
  }
}

// users
async function showUsersContent() {
  const usersTemplate = document.getElementById("users-template");
  const clone = usersTemplate.content.cloneNode(true);
  const tableBody = clone.querySelector("#users-table-body");

  dashboardMain.innerHTML = "";
  dashboardMain.appendChild(clone);

  try {
    const usersSnap = await getDocs(collection(db, "users"));
    tableBody.innerHTML = "";

    usersSnap.forEach((userDoc) => {
      const userData = userDoc.data();
      const tr = document.createElement("tr");

      const emailTd = document.createElement("td");
      emailTd.textContent = userData.email || "بدون إيميل";

      const roleTd = document.createElement("td");
      const roleSpan = document.createElement("span");
      roleSpan.classList.add("badge-role");
      if (userData.role === "admin") {
        roleSpan.classList.add("badge-admin");
        roleSpan.textContent = "مدير";
      } else if (userData.role === "vendor") {
        roleSpan.classList.add("badge-vendor");
        roleSpan.textContent = "بائع";
      } else {
        roleSpan.classList.add("badge-user");
        roleSpan.textContent = "مستخدم عادي";
      }
      roleTd.appendChild(roleSpan);

      const actionTd = document.createElement("td");

      if (userData.role !== "admin") {
        const toggleBtn = document.createElement("button");
        toggleBtn.classList.add("action-btn");

        const isVendor = userData.role === "vendor";

        if (isVendor) {
          toggleBtn.textContent = "إزالة بائع";
          toggleBtn.classList.add("remove-vendor");
        } else {
          toggleBtn.textContent = "تعيين كبائع";
          toggleBtn.classList.add("add-vendor");
        }

        toggleBtn.onclick = async () => {
          const newRole = isVendor ? "user" : "vendor";
          try {
            await updateDoc(doc(db, "users", userData.uid), {
              role: newRole
            });
            showUsersContent();
          } catch (error) {
            console.error("Error updating role:", error);
            alert("حدث خطأ أثناء تغيير دور المستخدم");
          }
        };

        actionTd.appendChild(toggleBtn);
      } else {
        actionTd.textContent = "لا يمكن التعديل";
        actionTd.style.color = "var(--text-light-gray)";
        actionTd.style.fontSize = "14px";
      }

      const nameTd = document.createElement("td");
      nameTd.textContent = userData.name || "مستخدم";
      nameTd.style.fontWeight = "600";

      tr.appendChild(nameTd);
      tr.appendChild(emailTd);
      tr.appendChild(roleTd);
      tr.appendChild(actionTd);

      tableBody.appendChild(tr);
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    tableBody.innerHTML = "<tr><td colspan='4' style='text-align: center;'>حدث خطأ في جلب المستخدمين</td></tr>";
  }
}



function exitDashboard() {
  const exitBtn = document.querySelector(".exit-btn")
  exitBtn.onclick = () => {
    window.location.pathname = "index.html"
  }
}
exitDashboard()

function showMobileDashboardSidebar() {
  const dashHamburger = document.getElementById("dash-hamburger");
  const dashAside = document.querySelector(".dash-aside");

  if (dashHamburger && dashAside) {
    dashHamburger.addEventListener("click", () => {
      dashAside.classList.toggle("active");
    });
  }
}
showMobileDashboardSidebar();