// Fixed tabbar khi scroll
window.addEventListener("scroll", function () {
  const tabbar = document.querySelector(".tabbar-control");
  const loginTable = document.querySelector(".login-table");
  const loginTableHeight = loginTable ? loginTable.offsetHeight : 0;

  if (window.scrollY > loginTableHeight) {
    tabbar.classList.add("tabbar-fixed");
    setTimeout(() => tabbar.classList.add("active"), 500);
  } else {
    tabbar.classList.remove("active");
    tabbar.classList.remove("tabbar-fixed");
  }
});

// Đợi DOM tải xong
document.addEventListener("DOMContentLoaded", () => {
  // Hàm kiểm tra và cập nhật trạng thái đăng nhập
  function updateLoginStatus() {
    const loginTable = document.querySelector(".login-table");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser && currentUser.username) {
      loginTable.innerHTML = `
        <span>Chào mừng: ${currentUser.username} | <a href="#" id="logout">Đăng xuất</a></span>
      `;
      const logoutButton = document.getElementById("logout");
      if (logoutButton) {
        logoutButton.addEventListener("click", function (e) {
          e.preventDefault();
          localStorage.removeItem("currentUser");
          window.location.reload();
        });
      }
    } else {
      loginTable.innerHTML = `
  <span><a href="./QUAN_LY_COFFEE/web_children/login.html">Đăng nhập</a></span>`;
    }
  }

  // Gọi hàm đăng nhập trước
  updateLoginStatus();
});
