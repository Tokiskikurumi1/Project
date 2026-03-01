const API_BASE = "https://localhost:7027/api";

const categoryListEl = document.getElementById("categoryList");
const productListEl = document.getElementById("product-list");
const searchInput = document.querySelector(
  '.right-list-food input[type="text"]',
);
const searchButton = document.querySelector(".right-list-food span");

let allProducts = [];
let allCategories = [];
let currentCategory = null;

// ========================== LOAD CATEGORY ==========================
async function loadCategory() {
  try {
    const res = await fetch(`${API_BASE}/LoadCoffee/load-category`);

    console.log("Status:", res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.log("Error text:", errText);
      throw new Error("Lỗi load category");
    }

    allCategories = await res.json();
    console.log("Category data:", allCategories);

    renderCategory();
  } catch (err) {
    console.error("Load category lỗi:", err);
  }
}

async function loadAllProducts() {
  try {
    const res = await fetch(`${API_BASE}/LoadCoffee/get-all`);
    if (!res.ok) throw new Error("Lỗi load sản phẩm");

    allProducts = await res.json();

    console.log("Products:", allProducts);

    renderProducts();
  } catch (err) {
    console.error("Lỗi load sản phẩm:", err);
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
    console.error(err);
  }
}

// ========================== RENDER CATEGORY ==========================
function renderCategory() {
  categoryListEl.innerHTML = "";

  // ====== NÚT ALL ======
  const allLi = document.createElement("li");
  allLi.textContent = "Tất cả";
  allLi.style.cursor = "pointer";
  allLi.style.fontWeight = "bold";

  allLi.addEventListener("click", () => {
    currentCategory = null; // null = không filter
    renderProducts();
  });

  categoryListEl.appendChild(allLi);

  // ====== CATEGORY TỪ DATABASE ======
  allCategories.forEach((cate) => {
    const li = document.createElement("li");
    li.textContent = cate.categoryName;
    li.style.cursor = "pointer";

    li.addEventListener("click", () => {
      currentCategory = cate.categoryID;
      renderProducts();
    });

    categoryListEl.appendChild(li);
  });
}

// ========================== RENDER PRODUCT ==========================
function renderProducts() {
  productListEl.innerHTML = "";

  let filtered = [...allProducts];

  // FILTER THEO CATEGORY
  if (currentCategory !== null) {
    filtered = filtered.filter((p) => p.categoryID === currentCategory);
  }

  // SEARCH THEO TÊN
  const keyword = searchInput.value.trim().toLowerCase();
  if (keyword) {
    filtered = filtered.filter((p) =>
      p.coffeeName.toLowerCase().includes(keyword),
    );
  }

  if (filtered.length === 0) {
    productListEl.innerHTML = "<p>Không có sản phẩm nào</p>";
    return;
  }

  filtered.forEach((product) => {
    const div = document.createElement("a");
    div.href = "#";
    div.className = "box";

    div.innerHTML = `
      <img src="${product.imageURL || "./img/default.png"}" />
      <h3 style="color:black;">${product.coffeeName}</h3>
      <div class="info">
        <span>${formatPrice(product.price)} VNĐ</span>
        <i class="fa-solid fa-cart-plus"></i>
      </div>
    `;

    productListEl.appendChild(div);
  });

  attachCartEvents();
}

// ========================== FORMAT PRICE ==========================
function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN").format(price);
}

// ========================== CART EVENT ==========================
function attachCartEvents() {
  const cartIcons = document.querySelectorAll(".fa-cart-plus");

  cartIcons.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const box = icon.closest(".box");
      const productName = box.querySelector("h3").textContent;
      const price = box.querySelector(".info span").textContent;
      const imageSrc = box.querySelector("img").src;

      addToCart(productName, price, imageSrc);
    });
  });
}

// ========================== SEARCH EVENT ==========================
searchButton.addEventListener("click", () => {
  renderProducts();
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    renderProducts();
  }
});

// ========================== START ==========================
loadCategory();
loadProducts();
