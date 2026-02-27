// header_sidebar.js

document.addEventListener("DOMContentLoaded", () => {
  // Load sidebar động (giữ nguyên)
  fetch("sidebar.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("sidebar-placeholder").innerHTML = html;

      // Sau khi sidebar load xong → attach active logic
      initActiveMenu();
      initSidebarToggle();
    })
    .catch((err) => console.error("Lỗi load sidebar:", err));
});

// Hàm khởi tạo active menu (chạy sau khi sidebar load)
function initActiveMenu() {
  const menuLinks = document.querySelectorAll(".sidebar-menu a");

  if (!menuLinks.length) return;

  const currentPath =
    window.location.pathname.split("/").pop() || "Dashboard.html"; // fallback nếu root

  menuLinks.forEach((link) => {
    const href = link.getAttribute("href");

    // Active mặc định dựa trên URL hiện tại
    if (
      href === `./${currentPath}` ||
      href === currentPath ||
      href.endsWith(currentPath)
    ) {
      link.classList.add("active");
    }

    // Xử lý click: chỉ active link được click (không preventDefault để href vẫn hoạt động)
    link.addEventListener("click", function () {
      // Bỏ qua đăng xuất nếu muốn
      if (this.getAttribute("href") === "../index.html") return;

      // Xóa active tất cả trước
      menuLinks.forEach((l) => l.classList.remove("active"));

      // Thêm active cho link này
      this.classList.add("active");
    });
  });
}

// Hàm toggle sidebar mobile
function initActiveMenu() {
  const menuLinks = document.querySelectorAll(".sidebar-menu a");

  if (!menuLinks.length) {
    console.warn("Không tìm thấy link trong sidebar");
    return;
  }

  // Lấy tên file trang hiện tại
  let currentFile = window.location.pathname.split("/").pop();
  if (currentFile.includes("?")) currentFile = currentFile.split("?")[0];
  if (!currentFile || currentFile === "" || currentFile === "/") {
    currentFile = "Dashboard.html";
  }

  console.log("Trang hiện tại:", currentFile); // Debug: kiểm tra console

  // Bước 1: Xóa sạch active của TẤT CẢ link trước
  menuLinks.forEach((link) => {
    link.classList.remove("active");
  });

  // Bước 2: Tìm và add active cho link khớp với trang hiện tại
  menuLinks.forEach((link) => {
    let href = link.getAttribute("href") || "";

    // Chuẩn hóa href: bỏ ./ nếu có
    if (href.startsWith("./")) href = href.substring(2);

    // So sánh linh hoạt (khớp phần cuối đường dẫn)
    if (
      href === currentFile ||
      href.endsWith("/" + currentFile) ||
      href.endsWith(currentFile)
    ) {
      link.classList.add("active");
      console.log("Active link:", href); // Debug
    }

    // Xử lý click (nếu click trong cùng trang hoặc trước khi chuyển)
    link.addEventListener("click", function () {
      // Bỏ qua đăng xuất
      if (this.getAttribute("href") === "../index.html") return;

      // Xóa active tất cả
      menuLinks.forEach((l) => l.classList.remove("active"));

      // Add active cho link này
      this.classList.add("active");
    });
  });
}
