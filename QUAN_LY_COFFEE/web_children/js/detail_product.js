const API_BASE = "https://localhost:7027/api";
const BACKEND_URL = "https://localhost:7114";

const imageEl = document.getElementById("product-image");
const nameEl = document.getElementById("product-name");
const priceEl = document.getElementById("product-price");
const descEl = document.getElementById("product-description");

const quantityInput = document.getElementById("quantity");
const decreaseBtn = document.getElementById("decrease-quantity");
const increaseBtn = document.getElementById("increase-quantity");

// ===== LẤY ID TỪ URL =====
const params = new URLSearchParams(window.location.search);
const coffeeID = params.get("id");

if (!coffeeID) {
  alert("Không tìm thấy sản phẩm");
  window.location.href = "../index.html";
}

// ===== LOAD DETAIL =====
async function loadCoffeeDetail() {
  try {
    const res = await fetch(
      `${API_BASE}/LoadCoffee/load-coffee-by-ID/${coffeeID}`,
    );

    if (!res.ok) {
      alert("Sản phẩm không tồn tại hoặc đã ngừng phục vụ");
      window.location.href = "../index.html";
      return;
    }

    const data = await res.json();

    const coffee = data[0]; // 🔥 thêm dòng này

    nameEl.textContent = coffee.coffeeName;

    priceEl.textContent =
      new Intl.NumberFormat("vi-VN").format(coffee.price) + " VNĐ";

    imageEl.src = coffee.imageURL
      ? BACKEND_URL + coffee.imageURL
      : "./img/default.png";

    // Nếu chưa có description trong DB thì để tạm
    descEl.textContent = "Thức uống thơm ngon, đậm đà hương vị.";
  } catch (err) {
    console.error("Lỗi load detail:", err);
  }
}

// ===== QUANTITY =====
decreaseBtn.addEventListener("click", () => {
  let value = parseInt(quantityInput.value);
  if (value > 1) quantityInput.value = value - 1;
});

increaseBtn.addEventListener("click", () => {
  let value = parseInt(quantityInput.value);
  quantityInput.value = value + 1;
});

// ===== ADD TO CART =====
document.getElementById("add-to-cart-btn").addEventListener("click", () => {
  const quantity = parseInt(quantityInput.value);

  alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
});

loadCoffeeDetail();
