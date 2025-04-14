// cofe.js

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
  // SEARCH
  const searchIcon = document.querySelector("#search-icon");
  const searchBox = document.querySelector(".search-box");
  if (searchIcon && searchBox) {
    searchIcon.addEventListener("click", toggleSearch);
    searchIcon.addEventListener("touchstart", toggleSearch); // Hỗ trợ mobile
  }

  function toggleSearch(e) {
    searchBox.classList.toggle("active");
    ul_bar.classList.remove("active");
    e.preventDefault(); // Ngăn hành vi mặc định trên mobile
  }

  // Chạy menu
  const menu_icon = document.querySelector("#menu-icon");
  const ul_bar = document.querySelector(".ul-bar");
  if (menu_icon && ul_bar) {
    menu_icon.addEventListener("click", toggleMenu);
    menu_icon.addEventListener("touchstart", toggleMenu); // Hỗ trợ mobile
  }

  function toggleMenu(e) {
    ul_bar.classList.toggle("active");
    if (searchBox) searchBox.classList.remove("active");
    e.preventDefault(); // Ngăn hành vi mặc định trên mobile
  }

  // Toggle danh mục sản phẩm
  const toggleItems = document.querySelectorAll(".toggle-choose-type");
  toggleItems.forEach((item) => {
    item.addEventListener("click", toggleSubMenu);
    item.addEventListener("touchstart", toggleSubMenu); // Hỗ trợ mobile
  });

  function toggleSubMenu(e) {
    const subMenu = this.querySelector(".type-of-coffee");
    if (subMenu) {
      subMenu.classList.toggle("active");
    }
    e.preventDefault();
  }

  // Hàm lấy danh sách sản phẩm từ LocalStorage
  function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || {};
  }

  // Khởi tạo mảng giỏ hàng
  let cart = JSON.parse(localStorage.getItem("list-dish")) || [];

  // Hàm thêm sản phẩm vào giỏ hàng
  function addToCart(productName, price, imageSrc) {
    const product = { name: productName, price, image: imageSrc, quantity: 1 };
    const existingProduct = cart.find((item) => item.name === productName);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push(product);
    }
    localStorage.setItem("list-dish", JSON.stringify(cart));
    alert(`${productName} đã được thêm vào giỏ hàng!`);
  }

  // Hàm gắn sự kiện cho các icon "fa-cart-plus"
  function attachCartEvents() {
    const cartIcons = document.querySelectorAll(".fa-cart-plus");
    cartIcons.forEach((icon) => {
      icon.addEventListener("click", (e) => {
        e.preventDefault();
        const box = icon.closest(".box");
        const productName = box.querySelector("h3").textContent;
        const price = box.querySelector(".info span").textContent;
        const imageSrc = box.querySelector("img").src;
        addToCart(productName, price, imageSrc);
      });
    });
  }

  // Xử lý khi chọn loại sản phẩm
  const typeLinks = document.querySelectorAll(".type-of-coffee li");
  const rightListFood = document.querySelector(".list-food-box");

  if (typeLinks && rightListFood) {
    typeLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const type = link.getAttribute("data-type");
        if (type) {
          updateProductList(type);
          attachCartEvents();
        }
        e.stopPropagation(); // Ngăn sự kiện lan lên toggle-choose-type
      });
      link.addEventListener("touchstart", (e) => {
        // Hỗ trợ mobile
        const type = link.getAttribute("data-type");
        if (type) {
          updateProductList(type);
          attachCartEvents();
        }
        e.stopPropagation();
      });
    });
  }

  // Hàm cập nhật danh sách sản phẩm
  function updateProductList(type) {
    const products = getProducts(); // Lấy dữ liệu từ LocalStorage
    const productList = products[type] || [];
    let html = "";

    if (productList.length > 0) {
      productList.forEach((product) => {
        html += `
          <div class="box">
            <img src="${product.image}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <div class="info">
              <span>${product.price}</span>
              <i class="fa-solid fa-cart-plus"></i>
            </div>
          </div>
        `;
      });
    } else {
      html = "<p>Không có sản phẩm nào trong danh mục này.</p>";
    }
    rightListFood.innerHTML = html;
  }

  // Hiển thị danh sách mặc định khi tải trang
  updateProductList("traditional-coffee");
  attachCartEvents();
});

//check đăng nhập
document.addEventListener("DOMContentLoaded", function () {
  const loginTable = document.querySelector(".login-table");

  // Kiểm tra xem có user đăng nhập không
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {
    // Nếu đã đăng nhập, hiển thị tên user và nút đăng xuất
    loginTable.innerHTML = `
          <span>Xin chào, ${currentUser.username} | <a href="#" id="logout">Đăng xuất</a></span>
      `;

    // Thêm sự kiện cho nút đăng xuất
    document.getElementById("logout").addEventListener("click", function (e) {
      e.preventDefault();
      // Xóa thông tin user khỏi localStorage
      localStorage.removeItem("currentUser");
      // Tải lại trang để cập nhật giao diện
      window.location.reload();
    });
  } else {
    // Nếu chưa đăng nhập, giữ nguyên giao diện mặc định
    loginTable.innerHTML = `
          <span><a href="./login_register/login.html">Đăng nhập</a></span>
      `;
  }
});
