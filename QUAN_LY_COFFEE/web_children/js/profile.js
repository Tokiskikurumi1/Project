const API = "https://localhost:7027/api/Customer";
const BASE_URL = "https://localhost:7027";
const PRODUCT_URL = "https://localhost:7114";

const token = localStorage.getItem("accessToken");

let avatarFile = null;
let avatarUrl = "";

// ================= LOAD PAGE =================
document.addEventListener("DOMContentLoaded", () => {
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  loadProfile();
});

// ================= LOAD PROFILE =================
async function loadProfile() {
  try {
    const res = await fetch(`${API}/get-profile`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) {
      console.error("API lỗi:", res.status);
      return;
    }

    const data = await res.json();

    console.log("PROFILE:", data);

    document.querySelector(".userName").innerText = data.username || "";
    document.getElementById("fullName").value = data.fullName || "";
    document.getElementById("userGender").value = data.gender || "";
    document.getElementById("userEmail").value = data.email || "";
    document.getElementById("userPhone").value = data.phone || "";
    document.getElementById("userAddress").value = data.address || "";
    document.getElementById("Password").value = data.passwordHash || "";
    document.querySelector(".createdAt").innerText = new Date(
      data.createdAt,
    ).toLocaleDateString("vi-VN");

    document.querySelector(".sidebar-name").innerText = data.fullName;

    if (data.avatar) {
      document.getElementById("previewAvatar").src = BASE_URL + data.avatar;
      avatarUrl = data.avatar;
      document.querySelector(".img-avt").src = BASE_URL + data.avatar;
    } else {
      document.getElementById("previewAvatar").src = "../image/user.jpg";
      avatarUrl = data.avatar;
      document.querySelector(".img-avt").src = "../image/user.jpg";
    }
  } catch (err) {
    console.error("Load profile error:", err);
  }
}

// ================= UPDATE PROFILE =================
document
  .querySelector(".profile-save button")
  .addEventListener("click", updateProfile);

async function updateProfile() {
  try {
    // nếu có chọn ảnh mới
    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile);

      const uploadRes = await fetch(`${API}/customer-upload-image`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });

      const uploadData = await uploadRes.json();

      avatarUrl = uploadData.imageUrl;
    }

    const body = {
      fullName: document.getElementById("fullName").value,
      gender: document.getElementById("userGender").value,
      email: document.getElementById("userEmail").value,
      phone: document.getElementById("userPhone").value,
      address: document.getElementById("userAddress").value,
      passwordHash: document.getElementById("Password").value,
      avatar: avatarUrl,
    };

    const res = await fetch(`${API}/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });

    const message = await res.text();

    alert(message);

    loadProfile();
  } catch (err) {
    console.error(err);
  }
}

// ================= UPLOAD AVATAR =================
document
  .getElementById("uploadAvatar")
  .addEventListener("change", previewAvatar);

function previewAvatar() {
  const file = this.files[0];

  if (!file) return;

  avatarFile = file;

  const reader = new FileReader();

  reader.onload = function (e) {
    document.getElementById("previewAvatar").src = e.target.result;
  };

  reader.readAsDataURL(file);
}

// ================= LOAD ORDERS =================
async function renderOrders(status = "All") {
  const list = document.getElementById("order-list");

  list.innerHTML = "Đang tải...";

  try {
    const res = await fetch(`${API}/get-orders?status=${status}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();

    list.innerHTML = "";

    if (data.length === 0) {
      list.innerHTML =
        "<p style='text-align:center;padding:40px'>Chưa có đơn hàng</p>";
      return;
    }

    // ================= GROUP BILL =================
    const bills = {};

    data.forEach((item) => {
      if (!bills[item.billID]) {
        bills[item.billID] = {
          billDate: item.billDate,
          status: item.status,
          statusName: item.statusName,
          products: [],
          total: 0,
        };
      }

      bills[item.billID].products.push(item);
      bills[item.billID].total += item.subTotal;
    });

    // ================= RENDER =================
    Object.keys(bills).forEach((billID) => {
      const bill = bills[billID];

      const item = document.createElement("div");
      item.className = "order-item";

      let productsHTML = "";

      bill.products.forEach((p) => {
        productsHTML += `
        <div class="order-product">

          <img src="${PRODUCT_URL + p.imageURL}" width="60"/>

          <span class="span-bill">${p.coffeeName} x${p.quantity}</span>

          <span class="span-bill" style="margin-left:auto">${formatMoney(p.subTotal)}</span>

        </div>
        `;
      });

      item.innerHTML = `

      <div class="order-header">

        <strong>#${billID}</strong>

        <span class="order-status status-${bill.status}">
          ${bill.statusName}
        </span>

      </div>

      <p>
        <small>${formatDate(bill.billDate)}</small>
      </p>

      ${productsHTML}

      <p class="order-total">
        <strong>Tổng: ${formatMoney(bill.total)}</strong>
      </p>

      ${
        bill.status === 0 || bill.status === 1
          ? `
      <div class="order-actions">

        <button onclick="cancelOrder(${billID})" class="cancel-btn">
        Hủy đơn
        </button>

      </div>
      `
          : ""
      }

      `;

      list.appendChild(item);
    });
  } catch (err) {
    console.error("Load orders error:", err);
  }
}

// ================= FILTER ORDERS =================
function filterOrders(status) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  event.currentTarget.classList.add("active");

  renderOrders(status);
}

// ================= CANCEL ORDER =================
async function cancelOrder(billId) {
  if (!confirm("Bạn có chắc muốn hủy đơn này?")) return;

  try {
    const res = await fetch(`${API}/cancel-order/${billId}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const message = await res.text();

    alert(message);

    renderOrders("All");
  } catch (err) {
    console.error(err);
  }
}

// ================= SHOW ORDERS =================
function showOrders() {
  document.getElementById("profile-info").style.display = "none";

  document.getElementById("orders-section").style.display = "block";

  document
    .querySelectorAll(".sidebar-menu a")
    .forEach((a) => a.classList.remove("active"));

  document.querySelectorAll(".sidebar-menu a")[1].classList.add("active");

  renderOrders("All");
}

// ================= SHOW PROFILE =================
function showProfile() {
  document.getElementById("profile-info").style.display = "block";

  document.getElementById("orders-section").style.display = "none";

  document
    .querySelectorAll(".sidebar-menu a")
    .forEach((a) => a.classList.remove("active"));

  document.querySelectorAll(".sidebar-menu a")[0].classList.add("active");
}

// ================= LOGOUT =================
document
  .querySelector(".sidebar-menu li:last-child a")
  .addEventListener("click", logout);

function logout() {
  localStorage.removeItem("accessToken");

  window.location.href = "login.html";
}

// ================= FORMAT MONEY =================
function formatMoney(number) {
  return Number(number).toLocaleString("vi-VN") + "đ";
}

// ================= FORMAT DATE =================
function formatDate(date) {
  return new Date(date).toLocaleString("vi-VN");
}
