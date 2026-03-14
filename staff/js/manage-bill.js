const API_BASE = "https://localhost:7203/api/ManageBill";

let currentBillId = null;
let bills = [];
let filteredBills = [];

let currentPage = 1;
const pageSize = 10;
/* ========================= */
/* TOKEN */
/* ========================= */

function getToken() {
  return localStorage.getItem("accessToken");
}

/* ========================= */
/* FORMAT PRICE */
/* ========================= */

function formatPrice(price) {
  return Number(price).toLocaleString("vi-VN") + "đ";
}

/* ========================= */
/* STATUS TEXT */
/* ========================= */

function getStatusText(status) {
  switch (status) {
    case 1:
      return "Chờ xác nhận";
    case 2:
      return "Đang giao";
    case 3:
      return "Hoàn thành";
    case 4:
      return "Đã huỷ";
    default:
      return "Không rõ";
  }
}

/* ========================= */
/* LOAD BILL */
/* ========================= */

async function loadBills() {
  try {
    const token = getToken();

    const res = await fetch(`${API_BASE}/get-all-bill`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    bills = await res.json();
    filteredBills = [...bills];

    renderBills();
    renderPagination();
  } catch (err) {
    console.error(err);
  }
}

/* ========================= */
/* BILL DETAIL */
/* ========================= */

async function openDetail(id) {
  try {
    currentBillId = id;

    const token = getToken();

    const res = await fetch(`${API_BASE}/get-bill-detail/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();

    if (!data || data.length === 0) return;

    const first = data[0];

    document.getElementById("detailId").innerText = id;
    document.getElementById("detailCustomer").innerText = first.customerName;
    document.getElementById("detailPhone").innerText = first.phone;
    document.getElementById("detailAddress").innerText = first.address;
    document.getElementById("detailStatus").innerText = getStatusText(
      first.status,
    );
    let productHtml = "";
    let total = 0;

    data.forEach((p) => {
      total += p.subTotal;

      productHtml += `
        <tr>
          <td>${p.coffeeName}</td>
          <td>${p.quantity}</td>
          <td>${formatPrice(p.unitPrice)}</td>
          <td>${formatPrice(p.subTotal)}</td>
        </tr>
      `;
    });

    document.getElementById("detailProducts").innerHTML = productHtml;
    document.getElementById("detailTotal").innerText = formatPrice(total);

    renderActions(first.status);

    document.getElementById("billModal").style.display = "flex";
  } catch (err) {
    console.error(err);
  }
}

/* ========================= */
/* UPDATE STATUS */
/* ========================= */

async function updateStatus(billId, status) {
  try {
    const token = getToken();

    const res = await fetch(
      `${API_BASE}/update-status?billId=${billId}&status=${status}`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
        },
      },
    );

    const msg = await res.text();

    alert(msg);

    closeModal();

    loadBills();
  } catch (err) {
    console.error(err);
  }
}

/* ========================= */
/* ACTION BUTTONS */
/* ========================= */

function confirmOrder(id) {
  updateStatus(id, 2);
}

function completeOrder(id) {
  updateStatus(id, 3);
}

function cancelOrder(id) {
  updateStatus(id, 4);
}

/* ========================= */
/* MODAL ACTION */
/* ========================= */

function renderActions(status) {
  const actions = document.getElementById("detailActions");

  actions.innerHTML = "";

  const id = currentBillId;

  if (status === 1) {
    actions.innerHTML = `
      <button onclick="confirmOrder(${id})">Xác nhận</button>
      <button onclick="cancelOrder(${id})">Huỷ</button>
    `;
  }

  if (status === 2) {
    actions.innerHTML = `
      <button onclick="completeOrder(${id})">Đã giao</button>
      <button onclick="cancelOrder(${id})">Huỷ</button>
      <button onclick="exportBillPDF('${id}')">Xuất hóa đơn</button>
    `;
  }
}

/* ========================= */
/* CLOSE MODAL */
/* ========================= */

function closeModal() {
  document.getElementById("billModal").style.display = "none";
}

/* ========================= */
/* EXPORT PDF */
/* ========================= */

function exportBillPDF(id) {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  doc.text("KURUMI COFFEE", 105, 20, null, null, "center");
  doc.text("HÓA ĐƠN THANH TOÁN", 105, 30, null, null, "center");

  doc.text("Mã hóa đơn: " + id, 20, 50);
  doc.text("Ngày: " + new Date().toLocaleString(), 20, 60);

  doc.text("Cảm ơn quý khách!", 105, 100, null, null, "center");

  doc.save("hoadon_" + id + ".pdf");
}

/* ========================= */
/* LOAD BILLS */
/* ========================= */
function renderBills() {
  const table = document.getElementById("billTable");
  table.innerHTML = "";

  const start = (currentPage - 1) * pageSize;
  const pageData = filteredBills.slice(start, start + pageSize);

  pageData.forEach((bill) => {
    let actions = "";

    if (bill.status === 1) {
      actions = `
        <button onclick="confirmOrder(${bill.billID})">Xác nhận</button>
        <button onclick="cancelOrder(${bill.billID})">Huỷ</button>
      `;
    }

    if (bill.status === 2) {
      actions = `
        <button onclick="completeOrder(${bill.billID})">Đã giao</button>
        <button onclick="cancelOrder(${bill.billID})">Huỷ</button>
        <button onclick="exportBillPDF('${bill.billID}')">Xuất hóa đơn</button>
      `;
    }

    table.innerHTML += `
    <tr onclick="openDetail(${bill.billID})">
      <td>${bill.billID}</td>
      <td>${bill.customerName}</td>
      <td>${bill.phone}</td>
      <td>${new Date(bill.billDate).toLocaleString()}</td>
      <td>
        <span class="status">${getStatusText(bill.status)}</span>
      </td>
      <td onclick="event.stopPropagation()">
        ${actions}
      </td>
    </tr>
    `;
  });
}
/* ========================= */
/* LOAD PAGINATION */
/* ========================= */
function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(filteredBills.length / pageSize);

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <button onclick="changePage(${i})" 
      class="${i === currentPage ? "active" : ""}">
        ${i}
      </button>
    `;
  }
}

/* ========================= */
/* CHANGE PAGE */
/* ========================= */
function changePage(page) {
  currentPage = page;
  renderBills();
  renderPagination();
}

/* ========================= */
/* SEARCH */
/* ========================= */

document.getElementById("searchBill").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();

  filteredBills = bills.filter(
    (b) =>
      b.billID.toString().includes(keyword) ||
      b.customerName.toLowerCase().includes(keyword) ||
      b.phone.includes(keyword),
  );

  currentPage = 1;
  renderBills();
  renderPagination();
});

/* ========================= */
/* FILTER */
/* ========================= */
document.getElementById("statusFilter").addEventListener("change", function () {
  const value = this.value;

  filteredBills = bills.filter((b) => {
    if (value === "all") return true;
    if (value === "pending") return b.status === 1;
    if (value === "processing") return b.status === 2;
    if (value === "done") return b.status === 3;
    if (value === "cancel") return b.status === 4;
  });

  currentPage = 1;
  renderBills();
  renderPagination();
});

/* ========================= */
/* FILTER BY DATE */
/* ========================= */

function filterByDate() {
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;

  filteredBills = bills.filter((b) => {
    const date = new Date(b.billDate);

    if (from && date < new Date(from)) return false;
    if (to && date > new Date(to)) return false;

    return true;
  });

  currentPage = 1;
  renderBills();
  renderPagination();
}

/* ========================= */
/* SORT BY TIME */
/* ========================= */

document.getElementById("sortTime").addEventListener("change", function () {
  const value = this.value;

  filteredBills.sort((a, b) => {
    if (value === "new") return new Date(b.billDate) - new Date(a.billDate);
    else return new Date(a.billDate) - new Date(b.billDate);
  });

  renderBills();
});

/* ========================= */
/* RESET FILTER */
/* ========================= */

function resetFilter() {
  document.getElementById("searchBill").value = "";
  document.getElementById("fromDate").value = "";
  document.getElementById("toDate").value = "";

  document.getElementById("statusFilter").value = "all";
  document.getElementById("sortTime").value = "new";

  filteredBills = [...bills];

  filteredBills.sort((a, b) => {
    return new Date(b.billDate) - new Date(a.billDate);
  });

  currentPage = 1;

  renderBills();
  renderPagination();
}

/* ========================= */
/* INIT */
/* ========================= */

window.onload = function () {
  loadBills();
};
