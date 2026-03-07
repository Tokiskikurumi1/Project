const API = "https://localhost:7114/api/ManageReport";

let productChart = null;
let categoryChart = null;

// ================= LOAD DEFAULT =================
document.addEventListener("DOMContentLoaded", () => {
  generateReport();
});

// ================= FORMAT MONEY =================
function formatMoney(num) {
  return num.toLocaleString("vi-VN") + "đ";
}

// ================= LOAD REPORT =================
async function generateReport() {
  const type = document.getElementById("reportPeriod").value;

  if (type === "ALL") {
    loadSummaryAll();
    loadTopProductAll();
    loadCategoryAll();
    loadCustomerAll();
  } else {
    loadSummaryType(type);
    loadTopProductType(type);
    loadCategoryType(type);
    loadCustomerType(type);
  }
}

// ================= FILTER DATE =================
async function filterBills() {
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;

  if (!from || !to) {
    alert("Vui lòng chọn ngày");
    return;
  }

  loadSummaryDate(from, to);
  loadTopProductDate(from, to);
  loadCategoryDate(from, to);
  loadCustomerDate(from, to);
}

// ================= RESET =================
function resetFilter() {
  document.getElementById("fromDate").value = "";
  document.getElementById("toDate").value = "";
  document.getElementById("reportPeriod").value = "ALL";

  generateReport();
}

//
// =================================================
// ================= SUMMARY =======================
// =================================================
//

async function loadSummaryAll() {
  const res = await fetch(`${API}/get-all-summary`);
  const data = await res.json();
  renderSummary(data);
}

async function loadSummaryDate(from, to) {
  const res = await fetch(`${API}/get-summary-by-date?from=${from}&to=${to}`);
  const data = await res.json();
  renderSummary(data);
}

async function loadSummaryType(type) {
  const res = await fetch(`${API}/get-summary-by-type?type=${type}`);
  const data = await res.json();
  renderSummary(data);
}

function renderSummary(data) {
  if (!data || data.length === 0) return;

  const summary = data[0];

  const revenue = summary.totalRevenue || 0;
  const orders = summary.totalBills || 0;
  const avg = summary.avgPerBill || 0;

  document.getElementById("totalRevenue").innerText = formatMoney(revenue);
  document.getElementById("orderCount").innerText = orders;
  document.getElementById("avgOrder").innerText = formatMoney(avg);
}

//
// =================================================
// ================= TOP PRODUCT ===================
// =================================================
//

async function loadTopProductAll() {
  const res = await fetch(`${API}/get-top-produc-all`);
  const data = await res.json();
  renderProductChart(data);
}

async function loadTopProductDate(from, to) {
  const res = await fetch(
    `${API}/get-top-product-by-date?from=${from}&to=${to}`,
  );
  const data = await res.json();
  renderProductChart(data);
}

async function loadTopProductType(type) {
  const res = await fetch(`${API}/get-top-products-by-type?type=${type}`);
  const data = await res.json();
  renderProductChart(data);
}

function renderProductChart(data) {
  const canvas = document.getElementById("topProductsChart");
  const container = canvas.parentElement;

  // nếu chưa có message element thì tạo
  let msg = container.querySelector(".no-data");
  if (!msg) {
    msg = document.createElement("p");
    msg.className = "no-data";
    msg.style.textAlign = "center";
    msg.style.color = "#888";
    msg.innerText = "Chưa có doanh thu";
    container.appendChild(msg);
  }

  if (!data || data.length === 0) {
    canvas.style.display = "none";
    msg.style.display = "block";
    return;
  }

  msg.style.display = "none";
  canvas.style.display = "block";

  const labels = data.map((x) => x.coffeeName);
  const values = data.map((x) => x.totalQuantity);

  if (productChart) productChart.destroy();

  productChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Số lượng bán",
          data: values,
          backgroundColor: "#6b4e31",
        },
      ],
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const index = context.dataIndex;

              const quantity = data[index].totalQuantity;
              const revenue = data[index].revenue;

              return [
                "Số lượng: " + quantity,
                "Doanh thu: " + revenue.toLocaleString("vi-VN") + "đ",
              ];
            },
          },
        },
      },
    },
  });
}

//
// =================================================
// ================= CATEGORY ======================
// =================================================
//

async function loadCategoryAll() {
  const res = await fetch(`${API}/get-top-category-all`);
  const data = await res.json();
  renderCategoryChart(data);
}

async function loadCategoryDate(from, to) {
  const res = await fetch(
    `${API}/get-top-category-by-date?from=${from}&to=${to}`,
  );
  const data = await res.json();
  renderCategoryChart(data);
}

async function loadCategoryType(type) {
  const res = await fetch(`${API}/get-top-category-by-type?type=${type}`);
  const data = await res.json();
  renderCategoryChart(data);
}

function renderCategoryChart(data) {
  const canvas = document.getElementById("categoryChart");
  const container = canvas.parentElement;

  let msg = container.querySelector(".no-data");
  if (!msg) {
    msg = document.createElement("p");
    msg.className = "no-data";
    msg.style.textAlign = "center";
    msg.style.color = "#888";
    msg.innerText = "Chưa có doanh thu";
    container.appendChild(msg);
  }

  if (!data || data.length === 0) {
    canvas.style.display = "none";
    msg.style.display = "block";
    return;
  }

  msg.style.display = "none";
  canvas.style.display = "block";

  const labels = data.map((x) => x.categoryName);
  const values = data.map((x) => x.revenue);

  if (categoryChart) categoryChart.destroy();

  categoryChart = new Chart(canvas, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
        },
      ],
    },
  });
}

//
// =================================================
// ================= CUSTOMER ======================
// =================================================
//

async function loadCustomerAll() {
  const res = await fetch(`${API}/get-top-customer-all`);
  const data = await res.json();
  renderCustomer(data);
}

async function loadCustomerDate(from, to) {
  const res = await fetch(
    `${API}/get-top-customer-by-date?from=${from}&to=${to}`,
  );
  const data = await res.json();
  renderCustomer(data);
}

async function loadCustomerType(type) {
  const res = await fetch(`${API}/get-top-customer-by-type?type=${type}`);
  const data = await res.json();
  renderCustomer(data);
}

function renderCustomer(data) {
  const tbody = document.getElementById("topCustomers");

  if (!data || data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center;color:#888;padding:20px">
          Chưa có doanh thu
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = "";

  data.forEach((c) => {
    const row = `
      <tr>
        <td style="padding:10px">${c.fullName}</td>
        <td style="padding:10px">${c.totalBills}</td>
        <td style="padding:10px">${c.totalSpent.toLocaleString("vi-VN")}đ</td>
      </tr>
    `;

    tbody.innerHTML += row;
  });
}
