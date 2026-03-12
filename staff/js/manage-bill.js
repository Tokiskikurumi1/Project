function formatPrice(price) {
  return price.toLocaleString("vi-VN") + "đ";
}

function confirmOrder(button) {
  let row = button.closest("tr");

  row.dataset.status = "processing";

  let statusCell = row.querySelector(".status");
  statusCell.className = "status processing";
  statusCell.innerText = "Đang giao";

  let actionCell = row.querySelector("td:last-child");

  let id = row.children[0].innerText;

  actionCell.innerHTML = `
    <button onclick="completeOrder(this)">Đã giao</button>
    <button onclick="cancelOrder(this)">Hủy</button>
    <button onclick="exportBillPDF('${id}')">Xuất hóa đơn</button>
  `;
}

function completeOrder(button) {
  let row = button.closest("tr");

  row.dataset.status = "done";

  let statusCell = row.querySelector(".status");
  statusCell.className = "status done";
  statusCell.innerText = "Hoàn thành";

  let actionCell = row.querySelector("td:last-child");

  actionCell.innerHTML = "";
}

function cancelOrder(button) {
  let row = button.closest("tr");

  row.dataset.status = "cancel";

  let statusCell = row.querySelector(".status");
  statusCell.className = "status cancel";
  statusCell.innerText = "Đã hủy";

  let actionCell = row.querySelector("td:last-child");

  actionCell.innerHTML = "";
}
/* ========================= */
/* Toast thông báo đơn mới */
/* ========================= */

function showToast() {
  let toast = document.getElementById("orderToast");

  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 1000);
}

/* ========================= */
/* Tự tạo đơn mới (demo) */
/* ========================= */

setInterval(() => {
  let now = new Date();
  let table = document.getElementById("billTable");

  let id = Math.floor(Math.random() * 100);

  let phone = "09" + Math.floor(10000000 + Math.random() * 90000000);

  let row = `
  <tr data-status="pending" data-date="${now.toISOString()}" onclick="openDetail(this)">

  <td>${id}</td>

  <td>Khách mới</td>

  <td>${phone}</td>

  <td>${new Date().toLocaleTimeString()}</td>

  <td>
  <span class="status pending">Chờ xác nhận</span>
  </td>

  <td onclick="event.stopPropagation()">

  <button onclick="confirmOrder(this)">Xác nhận</button>

  <button onclick="cancelOrder(this)">Hủy</button>

  </td>

  </tr>
  `;

  table.insertAdjacentHTML("afterbegin", row);

  paginateTable();

  showToast();
}, 10000);
document.getElementById("statusFilter").addEventListener("change", function () {
  let filter = this.value;
  let rows = document.querySelectorAll("#billTable tr");

  rows.forEach((row) => {
    if (filter === "all" || row.dataset.status === filter) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});
function openDetail(row) {
  currentRow = row;

  let id = row.children[0].innerText;
  let customer = row.children[1].innerText;
  let phone = row.children[2].innerText;

  let status = row.dataset.status;

  document.getElementById("detailId").innerText = id;
  document.getElementById("detailCustomer").innerText = customer;
  document.getElementById("detailPhone").innerText = phone;
  document.getElementById("detailAddress").innerText = "123 Nguyễn Trãi";

  document.getElementById("detailProducts").innerHTML = `
<tr>
<td>Cà phê sữa</td>
<td>2</td>
<td>${formatPrice(25000)}</td>
<td>${formatPrice(50000)}</td>
</tr>

<tr>
<td>Bạc xỉu</td>
<td>1</td>
<td>${formatPrice(30000)}</td>
<td>${formatPrice(30000)}</td>
</tr>
`;

  document.getElementById("detailTotal").innerText = formatPrice(80000);

  renderActions(status);

  document.getElementById("billModal").style.display = "flex";
}
function renderActions(status) {
  let actions = document.getElementById("detailActions");
  let statusSpan = document.getElementById("detailStatus");

  actions.innerHTML = "";

  if (status === "pending") {
    statusSpan.innerText = "Chờ xác nhận";

    actions.innerHTML = `

<button onclick="confirmDetail()">Xác nhận</button>
<button onclick="cancelDetail()">Huỷ</button>

`;
  }

  if (status === "processing") {
    statusSpan.innerText = "Đang giao";

    let id = document.getElementById("detailId").innerText;

    actions.innerHTML = `
<button onclick="doneDetail()">Đã giao</button>
<button onclick="cancelDetail()">Huỷ</button>
<button onclick="exportBillPDF('${id}')">Xuất hóa đơn</button>
`;
  }

  if (status === "done") {
    statusSpan.innerText = "Hoàn thành";
  }

  if (status === "cancel") {
    statusSpan.innerText = "Đã huỷ";
  }
}
function closeModal() {
  document.getElementById("billModal").style.display = "none";
}

window.onclick = function (e) {
  let modal = document.getElementById("billModal");

  if (e.target === modal) {
    modal.style.display = "none";
  }
};
let rowsPerPage = 10;
let currentPage = 1;

function paginateTable() {
  let table = document.getElementById("billTable");
  let rows = table.querySelectorAll("tr");

  let totalRows = rows.length;
  let totalPages = Math.ceil(totalRows / rowsPerPage);

  rows.forEach((row, index) => {
    if (
      index >= (currentPage - 1) * rowsPerPage &&
      index < currentPage * rowsPerPage
    ) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });

  renderPagination(totalPages);
}
function renderPagination(totalPages) {
  let container = document.getElementById("pagination");

  container.innerHTML = "";

  let prev = document.createElement("button");
  prev.innerText = "Prev";

  prev.disabled = currentPage === 1;

  prev.onclick = function () {
    currentPage--;
    paginateTable();
  };

  container.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    let btn = document.createElement("button");

    btn.innerText = i;

    if (i === currentPage) {
      btn.classList.add("active");
    }

    btn.onclick = function () {
      currentPage = i;
      paginateTable();
    };

    container.appendChild(btn);
  }

  let next = document.createElement("button");
  next.innerText = "Next";

  next.disabled = currentPage === totalPages;

  next.onclick = function () {
    currentPage++;
    paginateTable();
  };

  container.appendChild(next);
}
window.onload = function () {
  paginateTable();
};
function confirmDetail() {
  if (!currentRow) return;

  confirmOrder(currentRow.querySelector("button"));

  renderActions("processing");
}

function doneDetail() {
  if (!currentRow) return;

  completeOrder(currentRow.querySelector("button"));

  renderActions("done");
}

function cancelDetail() {
  if (!currentRow) return;

  cancelOrder(currentRow.querySelector("button"));

  renderActions("cancel");
}
document.getElementById("searchBill").addEventListener("keyup", function () {
  let keyword = this.value.toLowerCase();

  let rows = document.querySelectorAll("#billTable tr");

  rows.forEach((row) => {
    let id = row.children[0].innerText.toLowerCase();
    let name = row.children[1].innerText.toLowerCase();
    let phone = row.children[2].innerText.toLowerCase();

    if (
      id.includes(keyword) ||
      name.includes(keyword) ||
      phone.includes(keyword)
    ) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});
function filterByDate() {
  let from = document.getElementById("fromDate").value;
  let to = document.getElementById("toDate").value;

  let rows = document.querySelectorAll("#billTable tr");

  rows.forEach((row) => {
    let rowDate = new Date(row.dataset.date);

    if (!from && !to) {
      row.style.display = "";
      return;
    }

    let fromDate = from ? new Date(from) : null;
    let toDate = to ? new Date(to) : null;

    if ((!fromDate || rowDate >= fromDate) && (!toDate || rowDate <= toDate)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}
document.getElementById("sortTime").addEventListener("change", function () {
  let type = this.value;

  let table = document.getElementById("billTable");
  let rows = Array.from(table.querySelectorAll("tr"));

  rows.sort((a, b) => {
    let timeA = new Date(a.dataset.date);
    let timeB = new Date(b.dataset.date);

    return type === "new" ? timeB - timeA : timeA - timeB;
  });

  table.innerHTML = "";

  rows.forEach((row) => table.appendChild(row));

  paginateTable();
});

function exportBillPDF(id) {
  const { jsPDF } = window.jspdf;

  let doc = new jsPDF();

  doc.setFont("NotoSans-Regular");

  let rows = document.querySelectorAll("#billTable tr");
  let row = null;

  rows.forEach((r) => {
    if (r.children[0].innerText === id) {
      row = r;
    }
  });

  if (!row) {
    alert("Không tìm thấy hóa đơn");
    return;
  }

  let customer = row.children[1].innerText;

  let y = 20;

  doc.setFontSize(16);
  doc.text("KURUMI COFFEE", 105, y, null, null, "center");

  y += 10;

  doc.setFontSize(14);
  doc.text("HÓA ĐƠN THANH TOÁN", 105, y, null, null, "center");

  y += 15;

  doc.setFontSize(11);

  doc.text("Mã hóa đơn: " + id, 20, y);
  y += 7;

  doc.text("Ngày: " + new Date().toLocaleString(), 20, y);
  y += 7;

  doc.text("Khách hàng: " + customer, 20, y);

  y += 10;

  doc.text("---------------------------------------", 20, y);
  y += 8;

  doc.text("Tên món", 20, y);
  doc.text("SL", 100, y);
  doc.text("Giá", 130, y);
  doc.text("Tổng", 160, y);

  y += 8;

  doc.text("---------------------------------------", 20, y);
  y += 8;

  doc.text("Cà phê sữa", 20, y);
  doc.text("2", 100, y);
  doc.text("25.000", 130, y);
  doc.text("50.000", 160, y);

  y += 8;

  doc.text("Bạc xỉu", 20, y);
  doc.text("1", 100, y);
  doc.text("30.000", 130, y);
  doc.text("30.000", 160, y);

  y += 10;

  doc.text("---------------------------------------", 20, y);

  y += 10;

  doc.setFontSize(13);
  doc.text("Tổng tiền: 80.000đ", 20, y);

  y += 20;

  doc.setFontSize(10);
  doc.text("Quét QR để thanh toán", 105, y, null, null, "center");

  doc.save("hoadon_" + id + ".pdf");
}
