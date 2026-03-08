const orders = [
  {
    id: "HD00001",
    date: "19:08 27/02/2026",
    total: "1.250.000đ",
    status: "delivered",
    items: "Cà phê sữa đá x5, Trà sữa trân châu x3",
  },
  {
    id: "HD00002",
    date: "15:30 26/02/2026",
    total: "850.000đ",
    status: "shipping",
    items: "Matcha latte x4",
  },
  {
    id: "HD00003",
    date: "11:45 25/02/2026",
    total: "2.100.000đ",
    status: "pending",
    items: "Cappuccino nóng x10",
  },
  {
    id: "HD00004",
    date: "09:20 24/02/2026",
    total: "450.000đ",
    status: "cancelled",
    items: "Sinh tố dâu x2",
  },
];
document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.querySelector(".sidebar-toggle");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".overlay");
  const sidebarLinks = document.querySelectorAll(".sidebar a");

  // mở menu
  menuIcon.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("no-scroll"); // khóa scroll
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll"); // mở scroll lại
  });

  // click link sidebar -> đóng
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.classList.remove("no-scroll"); // mở lại scroll
    });
  });
});
// Hiển thị danh sách hóa đơn
function renderOrders(status = "all") {
  const list = document.getElementById("order-list");
  list.innerHTML = "";

  const filtered =
    status === "all" ? orders : orders.filter((o) => o.status === status);

  if (filtered.length === 0) {
    list.innerHTML =
      '<p style="text-align:center; color:#777; padding:40px;">Chưa có hóa đơn nào trong trạng thái này</p>';
    return;
  }

  filtered.forEach((order) => {
    const item = document.createElement("div");
    item.className = "order-item";
    item.innerHTML = `
            <div class="order-header">
            <strong>${order.id}</strong>
            <span class="order-status status-${order.status}">
                ${
                  order.status === "pending"
                    ? "Chờ xác nhận"
                    : order.status === "shipping"
                      ? "Chờ giao hàng"
                      : order.status === "delivered"
                        ? "Đã giao"
                        : "Đã hủy"
                }
            </span>
            </div>

            <p><small>${order.date}</small></p>
            <p>${order.items}</p>
            <p class="order-total"><strong>${order.total}</strong></p>

            ${
              order.status === "pending" || order.status === "shipping"
                ? `
                <div class="order-actions">
                    <button class="cancel-btn" onclick="cancelOrder('${order.id}')">
                    Hủy đơn hàng
                    </button>
                </div>
                `
                : ""
            }
            `;
    list.appendChild(item);
  });
}

// Chuyển tab trạng thái
function filterOrders(status) {
  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active"));
  event.currentTarget.classList.add("active");
  renderOrders(status);
}

// Hiển thị phần Hóa đơn của tôi
function showOrders() {
  document.getElementById("profile-info").style.display = "none";
  document.getElementById("orders-section").style.display = "block";
  document.querySelector(".sidebar-menu a.active").classList.remove("active");
  document.querySelector('.sidebar-menu a[href="#"]').classList.add("active");
  renderOrders("all");
}

// Mặc định hiển thị Thông tin cá nhân
document.getElementById("profile-info").style.display = "block";
