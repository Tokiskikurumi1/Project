const API_BASE = "https://localhost:7114/api/ManageDashboard";

let productChart = null;
let categoryChart = null;
let revenueChart = null;

function formatVND(num) {
  return num.toLocaleString("vi-VN") + "đ";
}

async function generateReport() {
  try {
    const from = document.getElementById("fromDate").value;
    const to = document.getElementById("toDate").value;

    const query = `?fromDate=${from}&toDate=${to}`;

    const [summaryRes, revenueRes, categoryRes, productRes, customerRes] =
      await Promise.all([
        fetch(`${API_BASE}/summary${query}`),
        fetch(`${API_BASE}/revenue-chart${query}`),
        fetch(`${API_BASE}/revenue-category${query}`),
        fetch(`${API_BASE}/top-products${query}`),
        fetch(`${API_BASE}/top-customers${query}`),
      ]);

    const summary = await summaryRes.json();
    const revenueData = await revenueRes.json();
    const categoryData = await categoryRes.json();
    const productData = await productRes.json();
    const customerData = await customerRes.json();

    renderSummary(summary);
    renderRevenueChart(revenueData);
    renderCategoryChart(categoryData);
    renderTopProducts(productData);
    renderTopCustomers(customerData);
  } catch (err) {
    console.error("Dashboard error:", err);
  }
}

function renderSummary(data) {
  document.getElementById("totalRevenue").textContent = formatVND(
    data.totalRevenue,
  );

  document.getElementById("orderCount").textContent = data.totalOrders;

  document.getElementById("avgOrder").textContent = formatVND(
    data.avgOrderValue,
  );
}

function renderRevenueChart(data) {
  const ctx = document.getElementById("revenueChart").getContext("2d");

  if (revenueChart) revenueChart.destroy();

  revenueChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((x) => x.day),
      datasets: [
        {
          label: "Doanh thu",
          data: data.map((x) => x.revenue),
          borderColor: "#6b4e31",
          backgroundColor: "rgba(107,78,49,0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
}

function renderCategoryChart(data) {
  const ctx = document.getElementById("categoryChart").getContext("2d");

  if (categoryChart) categoryChart.destroy();

  categoryChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: data.map((x) => x.categoryName),
      datasets: [
        {
          data: data.map((x) => x.revenue),
          backgroundColor: [
            "#8d6e63",
            "#d4af37",
            "#81c784",
            "#64b5f6",
            "#ff8a65",
          ],
        },
      ],
    },
    options: {
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
}

function renderTopProducts(data) {
  const ctx = document.getElementById("topProductsChart").getContext("2d");

  if (productChart) productChart.destroy();

  productChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map((x) => x.productName),
      datasets: [
        {
          label: "Số lượng bán",
          data: data.map((x) => x.quantity),
          backgroundColor: "#8d6e63",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
      },
    },
  });
}

function renderTopCustomers(data) {
  const tbody = document.getElementById("topCustomers");

  tbody.innerHTML = data
    .map(
      (c) => `
      <tr style="border-bottom:1px solid #eee">
        <td style="padding:12px">${c.fullName}</td>
        <td style="padding:12px">${c.totalBills}</td>
        <td style="padding:12px">${formatVND(c.totalSpent)}</td>
      </tr>
  `,
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  generateReport();
});
