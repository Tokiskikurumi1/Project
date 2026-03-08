fetch("header.html")
  .then((response) => {
    if (!response.ok) throw new Error("Không tìm thấy header.html");
    return response.text();
  })
  .then((data) => {
    document.getElementById("main-header").innerHTML = data;
    updateLoginStatus();
  })
  .catch((error) => console.error("Lỗi fetch:", error));

fetch("footer.html")
  .then((response) => {
    if (!response.ok) throw new Error("Không tìm thấy footer.html");
    return response.text();
  })
  .then((data) => {
    document.getElementById("main-footer").innerHTML = data;
  })
  .catch((error) => console.error("Lỗi fetch:", error));

function updateLoginStatus() {
  const loginTable = document.querySelector(".login-table");
  const currentUser = localStorage.getItem("user");

  if (currentUser) {
    loginTable.innerHTML = `
    <span>Chào mừng: <a href="./profile.html">${currentUser}</a> | <a href="#" id="logout">Đăng xuất</a></span>
  `;
    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
      logoutButton.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        window.location.reload();
      });
    }
  } else {
    loginTable.innerHTML = `
  <span><a href="./login.html">Đăng nhập</a></span>`;
  }
}
