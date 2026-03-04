// ================= CONFIG =================
const BASE_URL = "https://localhost:7114/api";
let allCustomers = [];
// ================= HELPER: CHECK NULL =================
function displayValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "null"
  ) {
    return "Chưa cập nhật";
  }
  return value;
}

// ================= LOAD ALL CUSTOMER =================
async function loadCustomers() {
  try {
    const res = await fetch(`${BASE_URL}/ManageCustomer/get-all-customer`);
    if (!res.ok) throw new Error("Không load được khách hàng");

    const data = await res.json();
    allCustomers = data; // lưu lại
    renderCustomers(data);
  } catch (err) {
    console.error(err);
    document.getElementById("customer-list").innerHTML =
      `<tr><td colspan="6" style="text-align:center">Lỗi tải dữ liệu</td></tr>`;
  }
}
// ================= APPLY FILTER =================
function applyFilter() {
  const keyword = document.getElementById("searchName").value.toLowerCase();

  const status = document.getElementById("statusFilter").value;

  let filtered = allCustomers;

  // lọc theo tên
  if (keyword) {
    filtered = filtered.filter((c) =>
      c.fullName?.toLowerCase().includes(keyword),
    );
  }

  // lọc theo trạng thái
  if (status !== "") {
    filtered = filtered.filter((c) => c.status.toString() === status);
  }

  renderCustomers(filtered);
}
// ================= RENDER TABLE =================
function renderCustomers(customers) {
  const tbody = document.getElementById("customer-list");
  tbody.innerHTML = "";

  if (!customers || customers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center">Chưa có khách hàng</td></tr>`;
    return;
  }

  customers.forEach((c, index) => {
    const statusIcon =
      c.status === 1
        ? `<i class="fas fa-lock-open status-active"
             title="Đang hoạt động - Click để khóa"
             onclick="updateStatus(${c.userID},0)"></i>`
        : `<i class="fas fa-lock status-locked"
             title="Đang bị khóa - Click để mở khóa"
             onclick="updateStatus(${c.userID},1)"></i>`;

    const totalSpent =
      c.totalSpent && c.totalSpent > 0
        ? c.totalSpent.toLocaleString() + " đ"
        : "Chưa có";

    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${displayValue(c.fullName)}</td>
        <td>${displayValue(c.phone)}</td>
        <td>${displayValue(c.address)}</td>
        <td>${totalSpent}</td>
        <td class="action-icons">
        <i class="fa-solid fa-eye"
        onclick="viewCustomerDetail(${c.userID})"></i>
          ${statusIcon}
        </td>
      </tr>
    `;

    tbody.innerHTML += row;
  });
}

// ================= VIEW BILL DETAIL =================
async function viewBill(billID) {
  if (!billID) {
    alert("Khách hàng chưa có hóa đơn!");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/ManageCustomer/bill-detail/${billID}`);

    if (!res.ok) throw new Error("Không lấy được chi tiết hóa đơn");

    const data = await res.json();
    showBillDetail(data);
  } catch (err) {
    console.error(err);
    alert("Lỗi khi tải chi tiết hóa đơn");
  }
}

// ================= SHOW MODAL =================
function showBillDetail(details) {
  if (!details || details.length === 0) return;

  const first = details[0];

  document.getElementById("detailBillId").innerText = displayValue(
    first.billID,
  );

  document.getElementById("detailDate").innerText = first.billDate
    ? new Date(first.billDate).toLocaleDateString()
    : "Chưa cập nhật";

  document.getElementById("detailCustomer").innerText = displayValue(
    first.fullName,
  );

  document.getElementById("detailPhone").innerText = displayValue(first.phone);

  document.getElementById("detailTotal").innerText = first.totalAmount
    ? first.totalAmount.toLocaleString() + " đ"
    : "Chưa cập nhật";

  const tbody = document.getElementById("detailBody");
  tbody.innerHTML = "";

  details.forEach((item) => {
    tbody.innerHTML += `
      <tr>
        <td>${displayValue(item.coffeeName)}</td>
        <td>${displayValue(item.quantity)}</td>
        <td>${
          item.unitPrice
            ? item.unitPrice.toLocaleString() + " đ"
            : "Chưa cập nhật"
        }</td>
      </tr>
    `;
  });

  document.getElementById("totalAmount").innerText = first.totalAmount
    ? first.totalAmount.toLocaleString() + " đ"
    : "Chưa cập nhật";

  document.getElementById("billDetailModal").style.display = "block";
}

// ================= HIDE MODAL =================
function hideBillDetailForm() {
  document.getElementById("billDetailModal").style.display = "none";
}

// ================= UPDATE STATUS =================
async function updateStatus(userID, status) {
  const confirmText =
    status === 0
      ? "Bạn có chắc muốn KHÓA tài khoản này?"
      : "Bạn có chắc muốn MỞ KHÓA tài khoản này?";

  if (!confirm(confirmText)) return;

  try {
    const res = await fetch(
      `${BASE_URL}/ManageCustomer/update-status/${userID}/${status}`,
      { method: "PUT" },
    );

    const message = await res.text();
    if (!res.ok) throw new Error(message);

    alert(message);
    loadCustomers();
  } catch (err) {
    alert(err.message);
  }
}

// ================= VIEW CUSTOMER DETAIL =================
async function viewCustomerDetail(userID) {
  try {
    const res = await fetch(
      `${BASE_URL}/ManageCustomer/get-customer-detail/${userID}`,
    );

    if (!res.ok) throw new Error("Không lấy được chi tiết khách hàng");

    const data = await res.json();

    if (!data || data.length === 0) {
      alert("Không có dữ liệu khách hàng!");
      return;
    }

    showCustomerDetail(data[0]);
  } catch (err) {
    console.error(err);
    alert("Lỗi khi tải chi tiết khách hàng");
  }
}

// ================= SHOW CUSTOMER DETAIL =================
function showCustomerDetail(customer) {
  document.getElementById("detailName").innerText = displayValue(
    customer.fullName,
  );

  document.getElementById("detailGender").innerText = displayValue(
    customer.gender,
  );

  document.getElementById("detailAddress").innerText = displayValue(
    customer.address,
  );

  document.getElementById("detailPhone").innerText = displayValue(
    customer.phone,
  );

  document.getElementById("detailEmail").innerText = displayValue(
    customer.email,
  );

  document.getElementById("detailCreateAt").innerText = customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString()
    : "Chưa cập nhật";

  document.getElementById("detailStatus").innerText =
    customer.status === 1 ? "Đang hoạt động" : "Đã bị khóa";

  document.getElementById("detailCustomerModal").style.display = "flex";
}

// ================= HIDE CUSTOMER DETAIL =================
function hideCustomerDetail() {
  document.getElementById("detailCustomerModal").style.display = "none";
}

// ================= RESET FILTER =================
function resetFilter() {
  document.getElementById("searchName").value = "";
  document.getElementById("statusFilter").value = "";
  renderCustomers(allCustomers);
}
// ================= INIT =================
document.addEventListener("DOMContentLoaded", loadCustomers);
