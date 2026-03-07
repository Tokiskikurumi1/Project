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
  document.getElementById("reportPeriod").value = "MONTH";

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
  if (!data) return;

  const labels = data.map((x) => x.coffeeName);
  const values = data.map((x) => x.totalQuantity);

  const ctx = document.getElementById("topProductsChart");

  if (productChart) productChart.destroy();

  productChart = new Chart(ctx, {
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
      responsive: true,
      plugins: {
        legend: {
          display: true,
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
  const labels = data.map((x) => x.categoryName);
  const values = data.map((x) => x.revenue);

  const ctx = document.getElementById("categoryChart");

  if (categoryChart) categoryChart.destroy();

  categoryChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "#6b4e31",
            "#a1887f",
            "#d7ccc8",
            "#8d6e63",
            "#bcaaa4",
          ],
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
  tbody.innerHTML = "";

  data.forEach((c) => {
    const row = `
      <tr>
        <td style="padding:10px">${c.fullName}</td>
        <td style="padding:10px">${c.totalBills}</td>
        <td style="padding:10px">${formatMoney(c.totalSpent)}</td>
      </tr>
    `;

    tbody.innerHTML += row;
  });
}
