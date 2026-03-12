document.addEventListener("DOMContentLoaded", function () {
  fetch("sidebar.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("sidebar").innerHTML = data;

      setupSidebarEvents();
    });
});

/* ================= */
/* TOGGLE SIDEBAR */
/* ================= */

function toggleSidebar() {
  let sidebar = document.querySelector(".staff-sidebar");
  let overlay = document.getElementById("overlay");

  sidebar.classList.toggle("show");
  overlay.classList.toggle("show");

  /* khóa scroll */

  if (sidebar.classList.contains("show")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}

/* ================= */
/* SIDEBAR EVENTS */
/* ================= */

function setupSidebarEvents() {
  let overlay = document.getElementById("overlay");
  let sidebar = document.querySelector(".staff-sidebar");

  /* click ngoài -> đóng */

  overlay.addEventListener("click", closeSidebar);

  /* click menu -> đóng */

  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });
}

function closeSidebar() {
  let sidebar = document.querySelector(".staff-sidebar");
  let overlay = document.getElementById("overlay");

  sidebar.classList.remove("show");
  overlay.classList.remove("show");

  document.body.style.overflow = "auto";
}
function viewDetail(id) {
  window.location.href = "bill-detail.html?id=" + id;
}
