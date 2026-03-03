// const API_BASE = "https://localhost:7129";
const API_BASE = "https://localhost:7027/api";
const BACKEND_URL = "https://localhost:7114";

const categoryListEl = document.getElementById("categoryList");
const productListEl = document.getElementById("product-list");
const searchInput = document.querySelector(
  '.right-list-food input[type="text"]',
);
const searchButton = document.querySelector(".right-list-food span");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const currentPageEl = document.getElementById("currentPage");

let allProducts = [];
let allCategories = [];
let currentCategory = null;

let currentPage = 1;
const itemsPerPage = 6;

// ========================== LOAD CATEGORY ==========================
async function loadCategory() {
  try {
    const res = await fetch(`${API_BASE}/LoadCoffee/load-category`);
    if (!res.ok) throw new Error("Lỗi load category");

    allCategories = await res.json();
    renderCategory();
  } catch (err) {
    console.error("Load category lỗi:", err);
  }
}

// ========================== LOAD PRODUCT ==========================
async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE}/LoadCoffee/load-product`);
    if (!res.ok) throw new Error("Lỗi load sản phẩm");

    allProducts = await res.json();
    renderProducts();
  } catch (err) {
    console.error("Lỗi load sản phẩm:", err);
  }
}

// ========================== RENDER CATEGORY ==========================
function renderCategory() {
  categoryListEl.innerHTML = "";

  // ===== NÚT ALL =====
  const allLi = document.createElement("li");
  allLi.textContent = "Tất cả";
  allLi.style.cursor = "pointer";
  allLi.style.fontWeight = "bold";

  allLi.addEventListener("click", () => {
    currentCategory = null;
    currentPage = 1;
    renderProducts();
  });

  categoryListEl.appendChild(allLi);

  // ===== CATEGORY TỪ DB =====
  allCategories.forEach((cate) => {
    const li = document.createElement("li");
    li.textContent = cate.categoryName;
    li.style.cursor = "pointer";

    li.addEventListener("click", () => {
      currentCategory = cate.categoryID;
      currentPage = 1;
      renderProducts();
    });

    categoryListEl.appendChild(li);
  });
}

// ========================== RENDER PRODUCT ==========================
function renderProducts() {
  productListEl.innerHTML = "";

  let filtered = [...allProducts];

  // ===== FILTER CATEGORY =====
  if (currentCategory !== null) {
    filtered = filtered.filter((p) => p.categoryID === currentCategory);
  }

  // ===== SEARCH =====
  const keyword = searchInput.value.trim().toLowerCase();
  if (keyword) {
    filtered = filtered.filter((p) =>
      p.coffeeName.toLowerCase().includes(keyword),
    );
  }

  // ===== PAGINATION =====
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  if (currentPage > totalPages) currentPage = 1;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = filtered.slice(start, end);

  if (paginatedItems.length === 0) {
    productListEl.innerHTML = "<p>Không có sản phẩm nào</p>";
    renderPagination(0);
    return;
  }

  // ===== RENDER PRODUCT =====
  paginatedItems.forEach((product) => {
    const div = document.createElement("a");
    div.href = `detail_product.html?id=${product.coffeeID}`;
    div.className = "box";

    div.innerHTML = `
      <img src="${
        product.imageURL ? BACKEND_URL + product.imageURL : "./img/default.png"
      }" />
      <h3 style="color:black; text-align:center;">${product.coffeeName}</h3>
      <div class="info">
        <span>${formatPrice(product.price)} VNĐ</span>
        <i id="cart-icon-${product.coffeeID}" class="fa-solid fa-cart-plus"></i>
      </div>
    `;

    productListEl.appendChild(div);
  });

  renderPagination(totalPages);
  attachCartEvents();
}

// ========================== RENDER PAGINATION ==========================
function renderPagination(totalPages) {
  if (totalPages === 0) {
    currentPageEl.textContent = "0 / 0";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  currentPageEl.textContent = `${currentPage} / ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// ========================== PAGINATION EVENT ==========================
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderProducts();
  }
});

nextBtn.addEventListener("click", () => {
  if (!nextBtn.disabled) {
    currentPage++;
    renderProducts();
  }
});

// ========================== FORMAT PRICE ==========================
function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN").format(price);
}

// ========================== CART EVENT ==========================
function attachCartEvents() {
  const cartIcons = document.querySelectorAll(".fa-cart-plus");

  cartIcons.forEach((icon) => {
    icon.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Vui lòng đăng nhập!");
        return;
      }

      const coffeeID = icon.id.split("-")[2]; // lấy ID từ cart-icon-3

      try {
        const res = await fetch(`${API_BASE}/Cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            coffeeId: parseInt(coffeeID),
            quantity: 1,
          }),
        });

        const message = await res.text();

        if (!res.ok) {
          alert(message);
          return;
        }

        // alert("Đã thêm vào giỏ hàng!");
        // icon.style.color = "green";
        // setTimeout(() => {
        //   icon.style.color = "";
        // }, 1000);
        icon.classList.remove("fa-cart-plus");
        icon.classList.add("fa-check");
        icon.style.color = "green";
        // Sau 1 giây đổi lại icon giỏ hàng
        setTimeout(() => {
          icon.classList.remove("fa-check");
          icon.classList.add("fa-cart-plus");
        }, 1000);
      } catch (err) {
        console.error("Lỗi thêm giỏ hàng:", err);
      }
    });
  });
}
// ========================== SEARCH EVENT ==========================
searchButton.addEventListener("click", () => {
  currentPage = 1;
  renderProducts();
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    currentPage = 1;
    renderProducts();
  }
});

// ========================== START ==========================
loadCategory();
loadProducts();
