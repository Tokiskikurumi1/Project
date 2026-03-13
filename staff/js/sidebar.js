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
  const sidebar = document.querySelector(".staff-sidebar");
  const overlay = document.getElementById("overlay");

  if (!sidebar) return;

  sidebar.classList.toggle("show");
  overlay.classList.toggle("show");

  if (sidebar.classList.contains("show")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}

/* ================= */
/* EVENTS */
/* ================= */

function setupSidebarEvents() {
  const overlay = document.getElementById("overlay");

  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });
}

function closeSidebar() {
  const sidebar = document.querySelector(".staff-sidebar");
  const overlay = document.getElementById("overlay");

  if (!sidebar) return;

  sidebar.classList.remove("show");
  overlay.classList.remove("show");

  document.body.style.overflow = "auto";
}

function viewDetail(id) {
  window.location.href = "bill-detail.html?id=" + id;
}
