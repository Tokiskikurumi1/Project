const API_BASE = "https://localhost:7027/api";
const BACKEND_URL = "https://localhost:7114";

const token = localStorage.getItem("accessToken");

const cartTable = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("total-price");

let cartData = [];

// ================= LOAD CART =================
async function loadCart() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("Bạn chưa đăng nhập!");
    return;
  }

  const response = await fetch(`${API_BASE}/Cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    alert("Phiên đăng nhập hết hạn!");
    localStorage.removeItem("accessToken");
    return;
  }

  const data = await response.json();
  console.log("Cart data:", data);

  cartData = data;
  renderCart();
}

// ================= RENDER CART =================
function renderCart() {
  cartTable.innerHTML = "";
  let total = 0;

  if (!cartData || cartData.length === 0) {
    cartTable.innerHTML = `<tr><td colspan="6" style="text-align: center;">Giỏ hàng trống</td></tr>`;
    totalPriceEl.innerText = "0 VND";
    return;
  }

  cartData.forEach((item) => {
    total += item.subTotal;

    cartTable.innerHTML += `
      <tr>
        <td><img src="${item.imageURL ? BACKEND_URL + item.imageURL : "./img/default.png"}" width="60"/></td>
        <td>${item.coffeeName}</td>
        <td>${formatMoney(item.unitPrice)}</td>
        <td>
          <button onclick="changeQuantity(${item.billDetailID}, ${
            item.quantity - 1
          })">-</button>
          <span class="quantity">${item.quantity}</span>
          <button onclick="changeQuantity(${item.billDetailID}, ${
            item.quantity + 1
          })">+</button>
        </td>
        <td>${formatMoney(item.subTotal)}</td>
      </tr>
    `;
  });

  totalPriceEl.innerText = formatMoney(total);
}

// ================= UPDATE QUANTITY =================
async function changeQuantity(billDetailID, newQuantity) {
  const token = localStorage.getItem("accessToken");

  try {
    const res = await fetch(`${API_BASE}/Cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        billDetailID: billDetailID,
        quantity: newQuantity,
      }),
    });

    const message = await res.text();

    if (!res.ok) {
      alert(message);
      return;
    }

    await loadCart();
  } catch (err) {
    console.error(err);
  }
}

// ================= CHECKOUT =================
async function processCheckout() {
  const token = localStorage.getItem("accessToken");

  try {
    const res = await fetch(`${API_BASE}/Cart/checkout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const message = await res.text();

    if (!res.ok) {
      alert(message);
      return;
    }

    alert(message);
    loadCart();
  } catch (err) {
    console.error(err);
  }
}

// ================= FORMAT MONEY =================
function formatMoney(number) {
  return number.toLocaleString("vi-VN") + " VND";
}

// ================= SHOW / HIDE FORM =================
function showCheckoutForm() {
  document.getElementById("checkoutForm").style.display = "block";
}

function hideCheckoutForm() {
  document.getElementById("checkoutForm").style.display = "none";
}

// ================= INIT =================
loadCart();
