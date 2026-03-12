function updateStatus(button, status) {
  let row = button.closest("tr");

  row.dataset.status = status;

  let statusCell = row.querySelector(".status");

  if (status === "processing") {
    statusCell.className = "status processing";
    statusCell.innerText = "Đang giao";
  }

  if (status === "done") {
    statusCell.className = "status done";
    statusCell.innerText = "Hoàn thành";
  }

  if (status === "cancel") {
    statusCell.className = "status cancel";
    statusCell.innerText = "Đã hủy";
  }
}

/* ========================= */
/* Toast thông báo đơn mới */
/* ========================= */

function showToast() {
  let toast = document.getElementById("orderToast");

  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

/* ========================= */
/* Tự tạo đơn mới (demo) */
/* ========================= */

setInterval(() => {
  let table = document.getElementById("billTable");

  let id = Math.floor(Math.random() * 1000);

  let row = `
<tr data-status="pending">

<td>${id}</td>
<td>Khách mới</td>
<td>${new Date().toLocaleTimeString()}</td>

<td>
<span class="status pending">Chờ xác nhận</span>
</td>

<td>

<button onclick="updateStatus(this,'processing')">
Xác nhận
</button>

<button onclick="updateStatus(this,'done')">
Hoàn thành
</button>

<button onclick="updateStatus(this,'cancel')">
Hủy
</button>

</td>

</tr>
`;

  table.insertAdjacentHTML("afterbegin", row);

  showToast();
}, 10000);
