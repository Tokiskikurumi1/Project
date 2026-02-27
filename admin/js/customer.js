// customer.js

// Lấy dữ liệu hóa đơn từ LocalStorage
const orders = JSON.parse(localStorage.getItem("orders")) || [];
let editingIndex = null;

function displayCustomers() {
  const customerList = document.getElementById("customer-list");
  customerList.innerHTML = ""; // Xóa nội dung cũ

  if (orders.length === 0) {
    customerList.innerHTML =
      '<tr><td colspan="6">Chưa có khách hàng nào</td></tr>';
  } else {
    orders.forEach((order, index) => {
      const row = document.createElement("tr");
      const orderId = `HD${String(index + 1).padStart(4, "0")}`;
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${order.customer.name}</td>
        <td>${order.customer.phone}</td>
        <td>${order.customer.address}</td>
        <td>${orderId}</td>
        <td>
          <button onclick="showEditCustomerForm(${index})">Sửa</button>
          <button onclick="deleteCustomer(${index})">Xóa</button>
        </td>
      `;
      customerList.appendChild(row);
    });
  }
}

// Hiển thị form sửa khách hàng
function showEditCustomerForm(index) {
  const order = orders[index];
  editingIndex = index;

  document.getElementById("editName").value = order.customer.name;
  document.getElementById("editPhone").value = order.customer.phone;
  document.getElementById("editAddress").value = order.customer.address;
  document.getElementById("editCustomerForm").style.display = "block";
}

// Lưu thông tin sửa
function saveEditCustomer() {
  const name = document.getElementById("editName").value;
  const phone = document.getElementById("editPhone").value;
  const address = document.getElementById("editAddress").value;

  if (name && phone && address) {
    orders[editingIndex].customer = { name, phone, address };
    localStorage.setItem("orders", JSON.stringify(orders));
    displayCustomers();
    cancelEditCustomer();
  } else {
    alert("Vui lòng điền đầy đủ thông tin!");
  }
}

// Hủy sửa
function cancelEditCustomer() {
  document.getElementById("editCustomerForm").style.display = "none";
  document.getElementById("editName").value = "";
  document.getElementById("editPhone").value = "";
  document.getElementById("editAddress").value = "";
  editingIndex = null;
}

// Xóa khách hàng
function deleteCustomer(index) {
  if (confirm("Bạn có chắc muốn xóa khách hàng này?")) {
    orders.splice(index, 1);
    localStorage.setItem("orders", JSON.stringify(orders));
    displayCustomers();
  }
}

// Hiển thị danh sách khách hàng khi trang được tải
document.addEventListener("DOMContentLoaded", displayCustomers);
