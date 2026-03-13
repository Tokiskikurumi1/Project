const API_BASE = "https://localhost:7114/api/Bill";

let allBills = [];

/* ==============================
   LOAD ALL BILL
============================== */
document.addEventListener("DOMContentLoaded", () => {
  loadBills();
});

async function loadBills() {
  try {
    const res = await fetch(`${API_BASE}/get-all-bill`);
    const data = await res.json();

    allBills = data;
    renderBills(data);
  } catch (err) {
    console.error("Lỗi load hóa đơn:", err);
  }
}

/* ==============================
   RENDER BILL TABLE
============================== */
function renderBills(bills) {
  const tbody = document.getElementById("bill-list");
  tbody.innerHTML = "";
  bills.forEach((bill, index) => {
    const statusText = bill.status === 1 ? "Đã thanh toán" : "Chưa thanh toán";

    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>#${bill.billID}</td>
        <td class="bill-date">${formatDate(bill.billDate)}</td>
        <td class="bill-total">${formatMoney(bill.totalAmount)}</td>
        <td class="bill-status">${statusText}</td>
        <td>
          <i class="fas fa-eye action-icon view"
             onclick="viewBillDetail(${bill.billID})"
             title="Xem chi tiết"></i>

          <i class="fas fa-trash action-icon delete"
             onclick="deleteBill(${bill.billID})"
             title="Xóa hóa đơn"></i>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

/* ==============================
   VIEW BILL DETAIL
============================== */
async function viewBillDetail(id) {
  try {
    const res = await fetch(`${API_BASE}/get-bill-by-id/${id}`);

    if (!res.ok) {
      console.log("API lỗi:", res.status);
      return;
    }

    const data = await res.json();
    console.log("Bill detail:", data);

    if (!data || !data.products || data.products.length === 0) {
      alert("Không tìm thấy hóa đơn");
      return;
    }

    const products = data.products;
    const logs = data.logs;

    const bill = products[0];

    document.getElementById("detailBillId").innerText = bill.billID;
    document.getElementById("detailDate").innerText = formatDate(bill.billDate);
    document.getElementById("detailCustomer").innerText = bill.customerName;
    document.getElementById("detailPhone").innerText = bill.phone;

    document.getElementById("billDetailModal").classList.add("active");
    document.getElementById("overlay").classList.add("active");

    /* =====================
       RENDER PRODUCT
    ===================== */
    const detailBody = document.getElementById("detailBody");
    detailBody.innerHTML = "";

    products.forEach((item) => {
      detailBody.innerHTML += `
        <tr>
          <td>${item.coffeeName}</td>
          <td>${item.quantity}</td>
          <td>${formatMoney(item.unitPrice)}</td>
        </tr>
      `;
    });

    document.getElementById("totalAmount").innerText = formatMoney(
      bill.totalAmount,
    );

    /* =====================
       RENDER BILL LOG
    ===================== */
    const historyDiv = document.getElementById("billHistory");
    historyDiv.innerHTML = "";

    if (!logs || logs.length === 0) {
      historyDiv.innerHTML = "<p>Chưa có lịch sử xử lý</p>";
    } else {
      logs.forEach((log) => {
        historyDiv.innerHTML += `
          <div class="history-item">
            <span class="history-time">${formatTime(log.actionTime)}</span>
            <span class="history-staff">${log.staffName}</span>
            <span class="history-action">${formatAction(log.actionType)}</span>
          </div>
        `;
      });
    }
  } catch (err) {
    console.error("Lỗi chi tiết hóa đơn:", err);
  }
}

/* ==============================
   DELETE BILL
============================== */
async function deleteBill(id) {
  const confirmDelete = confirm("Bạn có chắc muốn xóa hóa đơn này?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API_BASE}/delete-bill/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Xóa thành công");
      loadBills();
    } else {
      alert("Xóa thất bại");
    }
  } catch (err) {
    console.error("Lỗi xóa hóa đơn:", err);
  }
}

/* ==============================
   MODAL CLOSE
============================== */
function hideBillDetailForm() {
  const modal = document.getElementById("billDetailModal");
  const overlay = document.getElementById("overlay");

  modal.classList.remove("active");
  overlay.classList.remove("active");

  modal.style.display = "none"; // thêm dòng này cho chắc
}

/* ==============================
   FILTER (DÙNG DATA LOCAL)
============================== */
function filterBills() {
  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;
  const totalRange = document.getElementById("totalRange").value;

  const filtered = allBills.filter((bill) => {
    const billDate = new Date(bill.billDate);
    const billTotal = bill.totalAmount;

    let show = true;

    if (fromDate && new Date(fromDate) > billDate) show = false;
    if (toDate && new Date(toDate) < billDate) show = false;

    if (totalRange) {
      if (totalRange === "0-100000" && !(billTotal <= 100000)) show = false;

      if (
        totalRange === "100000-300000" &&
        !(billTotal > 100000 && billTotal <= 300000)
      )
        show = false;

      if (
        totalRange === "300000-500000" &&
        !(billTotal > 300000 && billTotal <= 500000)
      )
        show = false;

      if (totalRange === "500000+" && !(billTotal > 500000)) show = false;
    }

    return show;
  });

  renderBills(filtered);
}

function resetFilter() {
  document.getElementById("fromDate").value = "";
  document.getElementById("toDate").value = "";
  document.getElementById("totalRange").value = "";
  renderBills(allBills);
}

/* ==============================
   FORMAT
============================== */
function formatMoney(number) {
  return number.toLocaleString("vi-VN") + " đ";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAction(action) {
  switch (action) {
    case "CONFIRM":
      return "xác nhận đơn";
    case "SHIPPING":
      return "đang giao hàng";
    case "DELIVERED":
      return "giao thành công";
    case "CANCEL":
      return "hủy đơn";
    default:
      return action;
  }
}
