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

    if (!data || data.length === 0) {
      alert("Không tìm thấy hóa đơn");
      return;
    }

    const bill = data[0];

    document.getElementById("detailBillId").innerText = bill.billID;
    document.getElementById("detailDate").innerText = formatDate(bill.billDate);
    document.getElementById("detailCustomer").innerText = bill.fullName;
    document.getElementById("detailPhone").innerText = bill.phone;

    document.getElementById("billDetailModal").classList.add("active");
    document.getElementById("overlay").classList.add("active");
    detailBody.innerHTML = "";

    data.forEach((item) => {
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

    document.getElementById("billDetailModal").style.display = "block";
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
  document.getElementById("billDetailModal").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
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
