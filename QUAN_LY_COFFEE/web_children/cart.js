// cart.js

// Đợi DOM tải xong
document.addEventListener("DOMContentLoaded", () => {
  // Chạy menu
  const menu_icon = document.querySelector("#menu-icon");
  const ul_bar = document.querySelector(".ul-bar");
  if (menu_icon && ul_bar) {
    menu_icon.addEventListener("click", toggleMenu);
    menu_icon.addEventListener("touchstart", toggleMenu); // Hỗ trợ mobile
  }

  function toggleMenu(e) {
    ul_bar.classList.toggle("active");
    if (searchBox) searchBox.classList.remove("active");
    e.preventDefault(); // Ngăn hành vi mặc định trên mobile
  }
});

// Lấy dữ liệu từ localStorage
const cart = JSON.parse(localStorage.getItem("list-dish")) || [];

function displayCart() {
  const cartItems = document.getElementById("cart-items");
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<tr><td colspan="4" rowspan="2">Giỏ hàng trống</td></tr>';
  } else {
    cartItems.innerHTML = cart
      .map((item) => {
        const priceNum = parseFloat(item.price.replace(/[^\d]/g, ""));
        const itemTotal = priceNum * item.quantity;
        total += itemTotal;
        return `
          <tr>
            <td>
              <div class="product-name">
                <img src="${item.image}" alt="" />
                <span>${item.name}</span>
              </div>
            </td>
            <td>${item.price}</td>
            <td>
              <button onclick="updateQuantity('${item.name}', -1)">-</button>
              <input type="number" value="${item.quantity}" readonly />
              <button onclick="updateQuantity('${item.name}', 1)">+</button>
            </td>
            <td>${itemTotal.toLocaleString("vi-VN")}VND</td>
          </tr>
        `;
      })
      .join("");
  }

  // Cập nhật tổng tiền
  document.getElementById("total-price").textContent = `${total.toLocaleString(
    "vi-VN"
  )}VND`;
}

function updateQuantity(productName, change) {
  const item = cart.find((item) => item.name === productName);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart.splice(cart.indexOf(item), 1); // Xóa sản phẩm nếu số lượng <= 0
    }
    localStorage.setItem("list-dish", JSON.stringify(cart));
    displayCart(); // Cập nhật lại giao diện
  }
}

// Hiển thị form thanh toán
function showCheckoutForm() {
  if (cart.length === 0) {
    alert("Giỏ hàng trống, không thể đặt hàng!");
    return;
  }
  document.getElementById("checkoutForm").style.display = "block";
}

// Ẩn form thanh toán
function hideCheckoutForm() {
  document.getElementById("checkoutForm").style.display = "none";
  document.getElementById("customerName").value = "";
  document.getElementById("customerPhone").value = "";
  document.getElementById("customerAddress").value = "";
}

// Xử lý thanh toán
function processCheckout() {
  const name = document.getElementById("customerName").value;
  const phone = document.getElementById("customerPhone").value;
  const address = document.getElementById("customerAddress").value;

  if (name && phone && address) {
    // Tạo hóa đơn
    const order = {
      customer: { name, phone, address },
      items: [...cart],
      total: document.getElementById("total-price").textContent,
      date: new Date().toISOString(),
    };

    // Lưu hóa đơn vào LocalStorage
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Xóa giỏ hàng sau khi thanh toán
    localStorage.removeItem("list-dish");
    cart.length = 0;

    // Ẩn form và hiển thị thông báo
    hideCheckoutForm();
    alert("Thanh toán thành công!");
    displayCart();
  } else {
    alert("Vui lòng điền đầy đủ thông tin!");
  }
}

// Hiển thị giỏ hàng khi trang được tải
document.addEventListener("DOMContentLoaded", displayCart);
