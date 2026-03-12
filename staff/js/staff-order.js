/* ORDER STATUS CHART */

const orderCtx = document.getElementById("orderChart");

new Chart(orderCtx, {
  type: "doughnut",
  data: {
    labels: ["Chờ xác nhận", "Đang giao", "Hoàn thành"],
    datasets: [
      {
        data: [5, 8, 6],
        backgroundColor: ["#3498db", "#f06292", "#f39c12"],
        borderWidth: 0,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  },
});

/* REVENUE CHART */

const revenueCtx = document.getElementById("revenueChart");

new Chart(revenueCtx, {
  type: "pie",
  data: {
    labels: ["Cà phê", "Trà", "Bánh"],
    datasets: [
      {
        data: [3200000, 1200000, 800000],
        backgroundColor: ["#3498db", "#f06292", "#f39c12"],
        borderWidth: 0,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  },
});
