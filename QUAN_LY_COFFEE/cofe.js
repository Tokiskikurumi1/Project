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

  // Xử lý tìm kiếm sản phẩm
  const searchInput = document.querySelector(
    '.right-list-food input[type="text"]'
  );
  const searchButton = document.querySelector(".right-list-food span");

  if (searchInput && searchButton) {
    // Tìm kiếm khi nhấn nút "Tìm kiếm"
    searchButton.addEventListener("click", () => {
      const keyword = searchInput.value.trim().toLowerCase();
      searchProducts(keyword);
    });

    // Tìm kiếm khi nhấn Enter trong ô input
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const keyword = searchInput.value.trim().toLowerCase();
        searchProducts(keyword);
      }
    });

    // Tìm kiếm theo thời gian thực khi người dùng nhập (tùy chọn)
    // searchInput.addEventListener("input", () => {
    //   const keyword = searchInput.value.trim().toLowerCase();
    //   searchProducts(keyword);
    // });
  }

  // Hàm tìm kiếm sản phẩm
  function searchProducts(keyword) {
    const products = getProducts(); // Lấy tất cả sản phẩm từ LocalStorage
    const rightListFood = document.querySelector(".list-food-box");
    let html = "";

    // Lọc sản phẩm từ tất cả các danh mục
    let foundProducts = [];
    Object.keys(products).forEach((type) => {
      const matchingProducts = products[type].filter((product) =>
        product.name.toLowerCase().includes(keyword)
      );
      foundProducts = foundProducts.concat(matchingProducts);
    });

    // Hiển thị kết quả tìm kiếm
    if (foundProducts.length > 0) {
      foundProducts.forEach((product) => {
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
      html = "<p>Không tìm thấy sản phẩm nào.</p>";
    }

    rightListFood.innerHTML = html;
    attachCartEvents(); // Gắn lại sự kiện cho các nút "Thêm vào giỏ hàng"
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

// GỬI LIÊN HỆ
const Btn_send = document.querySelector(".btn-send");
Btn_send.addEventListener("click", function () {
  const fullname = document.querySelector(".fullname-contact");
  const email_contact = document.querySelector(".email-contact");
  const content_contact = document.querySelector(".content-contact");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !fullname.value.trim() ||
    !email_contact.value.trim() ||
    !content_contact.value.trim()
  ) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }
  if (!emailRegex.test(email_contact.value.trim())) {
    alert("Nhập Email đúng định dạng!");
    return;
  }
  // Lưu thông tin vào LocalStorage
  const contactData = {
    fullname,
    email: email_contact.value.trim(),
    content: content_contact.value.trim(),
    timestamp: new Date().toISOString(),
  };

  // Lấy danh sách liên hệ hiện có hoặc khởi tạo mảng rỗng
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contacts.push(contactData); // Thêm dữ liệu mới
  localStorage.setItem("contacts", JSON.stringify(contacts)); // Lưu lại

  // Hiển thị thông báo thành công
  alert("Gửi thông tin liên hệ thành công!");

  // Xóa nội dung form
  fullname.value = "";
  email_contact.value = "";
  content_contact.value = "";
});

//check đăng nhập
// Kiểm tra trạng thái đăng nhập khi tải trang
document.addEventListener("DOMContentLoaded", function () {
  const loginTable = document.querySelector(".login-table");

  // Kiểm tra xem có user đăng nhập không
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {
    // Nếu đã đăng nhập, hiển thị "Chào mừng: tên user" và nút đăng xuất
    loginTable.innerHTML = `
      <span>Chào mừng: ${currentUser.username} | <a href="#" id="logout">Đăng xuất</a></span>
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
    // Nếu chưa đăng nhập, hiển thị liên kết đăng nhập
    loginTable.innerHTML = `
      <span><a href="./login_register/login.html">Đăng nhập</a></span>
    `;
  }
});
