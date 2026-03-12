let status = "pending";

function confirmOrder() {
  status = "processing";

  document.getElementById("orderStatus").className = "status processing";

  document.getElementById("orderStatus").innerText = "Chờ giao";

  document.getElementById("actionButtons").innerHTML = `

<button class="btn-done" onclick="completeOrder()">Đã giao</button>

<button class="btn-cancel" onclick="cancelOrder()">Huỷ</button>

`;
}

function completeOrder() {
  status = "done";

  document.getElementById("orderStatus").className = "status done";

  document.getElementById("orderStatus").innerText = "Hoàn thành";

  document.getElementById("actionButtons").innerHTML = "";
}

function cancelOrder() {
  status = "cancel";

  document.getElementById("orderStatus").className = "status cancel";

  document.getElementById("orderStatus").innerText = "Đã huỷ";

  document.getElementById("actionButtons").innerHTML = "";
}
