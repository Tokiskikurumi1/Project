// bills.js - VERSION FIX HOÀN CHỈNH

const orders = JSON.parse(localStorage.getItem("orders")) || [];

function displayBills() {
  const billList = document.getElementById("bill-list");
  if (!billList) {
    console.error("Không tìm thấy #bill-list");
    return;
  }

  billList.innerHTML = "";

  if (orders.length === 0) {
    billList.innerHTML =
      '<tr><td colspan="5" style="text-align:center; padding:40px; color:#8d6e63;">Chưa có hóa đơn nào</td></tr>';
    return;
  }

  orders.forEach((order, index) => {
    const row = document.createElement("tr");
    const orderId = `HD${String(index + 1).padStart(5, "0")}`;
    const date = new Date(order.date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${orderId}</td>
      <td>${date}</td>
      <td>${order.total.toLocaleString("vi-VN")}đ</td>
      <td>
        <button class="btn-action view-btn" data-index="${index}">
          <i class="fas fa-eye"></i> Xem chi tiết
        </button>
        <button class="btn-action delete-btn" data-index="${index}">
          <i class="fas fa-trash"></i> Xóa
        </button>
      </td>
    `;

    // Click row mở chi tiết
    row.style.cursor = "pointer";
    row.addEventListener("click", (e) => {
      if (e.target.closest(".view-btn, .delete-btn")) return;
      showBillDetail(index);
    });

    billList.appendChild(row);
  });

  // Nút Xem chi tiết
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const index = parseInt(btn.dataset.index);
      showBillDetail(index);
    });
  });

  // Nút Xóa
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const index = parseInt(btn.dataset.index);
      deleteBill(index);
    });
  });
}

function showBillDetail(index) {
  const order = orders[index];
  if (!order) {
    console.error("Không tìm thấy hóa đơn tại index:", index);
    return alert("Không tìm thấy hóa đơn!");
  }

  const modal = document.getElementById("billDetailModal");
  if (!modal) {
    console.error("Modal #billDetailModal không tồn tại!");
    return;
  }

  console.log("Mở chi tiết hóa đơn:", index, order); // DEBUG để kiểm tra data

  // Cập nhật tiêu đề
  document.getElementById("detailBillId").textContent =
    `HD${String(index + 1).padStart(5, "0")}`;

  // Cập nhật thông tin (đây là phần bị thiếu trước đó)
  document.getElementById("detailDate").textContent =
    new Date(order.date).toLocaleString("vi-VN") || "Không có";
  document.getElementById("detailCustomer").textContent =
    order.customer?.name || "Không có thông tin";
  document.getElementById("detailPhone").textContent =
    order.customer?.phone || "Không có";
  document.getElementById("detailTotal").textContent =
    `${order.total.toLocaleString("vi-VN")}đ`;

  // Trong hàm showBillDetail(index)
  const itemsBody = document.getElementById("billDetailItems");
  itemsBody.innerHTML = "";

  (order.items || []).forEach((item) => {
    // Lấy giá và số lượng an toàn, fallback 0 nếu không phải số
    const price = Number(item.price) || 0; // chuyển thành số, nếu lỗi thì 0
    const quantity = Number(item.quantity) || 0;
    const thanhTien = price * quantity;

    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${item.name || "Không có tên"}</td>
    <td>${price.toLocaleString("vi-VN")}đ</td>
    <td>${quantity}</td>
    <td>${thanhTien.toLocaleString("vi-VN")}đ</td>
  `;
    itemsBody.appendChild(tr);
  });

  // Mở modal
  modal.classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

function hideBillDetailForm() {
  const modal = document.getElementById("billDetailModal");
  const overlay = document.getElementById("overlay");
  if (modal) modal.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
}

function deleteBill(index) {
  if (confirm("Bạn có chắc muốn xóa hóa đơn này?")) {
    orders.splice(index, 1);
    localStorage.setItem("orders", JSON.stringify(orders));
    displayBills();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Trang bills load xong, render bills...");
  displayBills();
});
