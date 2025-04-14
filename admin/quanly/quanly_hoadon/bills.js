// bills.js

// Lấy dữ liệu hóa đơn từ LocalStorage
const orders = JSON.parse(localStorage.getItem("orders")) || [];
let editingIndex = null;

function displayBills() {
  const billList = document.getElementById("bill-list");
  billList.innerHTML = ""; // Xóa nội dung cũ

  if (orders.length === 0) {
    billList.innerHTML = '<tr><td colspan="5">Chưa có hóa đơn nào</td></tr>';
  } else {
    orders.forEach((order, index) => {
      const row = document.createElement("tr");
      const orderId = `HD${String(index + 1).padStart(4, "0")}`;
      const date = new Date(order.date).toLocaleString("vi-VN");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${orderId}</td>
        <td>${date}</td>
        <td><button onclick="showBillDetail(${index})">Xem chi tiết</button></td>
        <td>
          <button onclick="showEditBillForm(${index})">Sửa</button>
          <button onclick="deleteBill(${index})">Xóa</button>
        </td>
      `;
      billList.appendChild(row);
    });
  }
}

// Hiển thị form sửa hóa đơn
function showEditBillForm(index) {
  const order = orders[index];
  editingIndex = index;

  document.getElementById("editName").value = order.customer.name;
  document.getElementById("editPhone").value = order.customer.phone;
  document.getElementById("editAddress").value = order.customer.address;
  document.getElementById("editBillForm").style.display = "block";
}

// Lưu thông tin sửa
function saveEditBill() {
  const name = document.getElementById("editName").value;
  const phone = document.getElementById("editPhone").value;
  const address = document.getElementById("editAddress").value;

  if (name && phone && address) {
    orders[editingIndex].customer = { name, phone, address };
    localStorage.setItem("orders", JSON.stringify(orders));
    displayBills();
    cancelEditBill();
  } else {
    alert("Vui lòng điền đầy đủ thông tin!");
  }
}

// Hủy sửa
function cancelEditBill() {
  document.getElementById("editBillForm").style.display = "none";
  document.getElementById("editName").value = "";
  document.getElementById("editPhone").value = "";
  document.getElementById("editAddress").value = "";
  editingIndex = null;
}

// Xóa hóa đơn
function deleteBill(index) {
  if (confirm("Bạn có chắc muốn xóa hóa đơn này?")) {
    orders.splice(index, 1);
    localStorage.setItem("orders", JSON.stringify(orders));
    displayBills();
  }
}

// Hiển thị chi tiết hóa đơn
function showBillDetail(index) {
  const order = orders[index];
  const billDetailItems = document.getElementById("billDetailItems");
  billDetailItems.innerHTML = "";

  order.items.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${item.image}" alt="${item.name}"></td>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
    `;
    billDetailItems.appendChild(row);
  });

  document.getElementById(
    "billTotal"
  ).textContent = `Tổng tiền: ${order.total}`;
  document.getElementById("billDetailForm").style.display = "block";
}

// Ẩn form chi tiết hóa đơn
function hideBillDetailForm() {
  document.getElementById("billDetailForm").style.display = "none";
}

// Hiển thị danh sách hóa đơn khi trang được tải
document.addEventListener("DOMContentLoaded", displayBills);
