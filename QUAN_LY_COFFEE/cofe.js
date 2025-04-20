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

    console.log("Trang hiện tại:", window.location.pathname);
    console.log("currentUser:", currentUser);

    if (!loginTable) {
      console.warn("Không tìm thấy .login-table trên trang này");
      return;
    }

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
        <span><a href="${
          window.location.pathname.includes("web_children")
            ? "../login_register/login.html"
            : "./login_register/login.html"
        }">Đăng nhập</a></span>
      `;
    }
  }

  // Gọi hàm đăng nhập trước
  updateLoginStatus();

  // Chạy menu
  const menu_icon = document.querySelector("#menu-icon");
  const ul_bar = document.querySelector(".ul-bar");
  if (menu_icon && ul_bar) {
    menu_icon.addEventListener("click", toggleMenu);
    menu_icon.addEventListener("touchstart", toggleMenu); // Hỗ trợ mobile
  }

  function toggleMenu(e) {
    ul_bar.classList.toggle("active");
    e.preventDefault(); // Ngăn hành vi mặc định trên mobile
  }

  // Toggle danh mục sản phẩm
  const toggleItems = document.querySelectorAll(".toggle-choose-type");
  if (toggleItems) {
    toggleItems.forEach((item) => {
      item.addEventListener("click", toggleSubMenu);
      item.addEventListener("touchstart", toggleSubMenu); // Hỗ trợ mobile
    });
  }

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
    if (cartIcons) {
      cartIcons.forEach((icon) => {
        icon.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation(); // Ngăn click trên icon kích hoạt link của box
          const box = icon.closest(".box");
          const productName = box.querySelector("h3").textContent;
          const price = box.querySelector(".info span").textContent;
          const imageSrc = box.querySelector("img").src;
          addToCart(productName, price, imageSrc);
        });
      });
    }
  }

  //HÀM LOAD SẢN PHẨM
  const rightListFood = document.querySelector(".list-food-box");
  if (rightListFood) {
    const typeLinks = document.querySelectorAll(".type-of-coffee li");
    const searchInput = document.querySelector(
      '.right-list-food input[type="text"]'
    );
    const searchButton = document.querySelector(".right-list-food span");

    function updateProductList(type) {
      const products = getProducts();
      const productList = products[type] || [];
      let html = "";

      if (productList.length > 0) {
        productList.forEach((product, index) => {
          html += `
            <a href="detail_product.html?category=${type}&index=${index}" class="box">
              <img src="${product.image}" alt="" />
              <h3 style="color: black;">${product.name}</h3>
              <div class="info">
                <span>${product.price}</span>
                <i class="fa-solid fa-cart-plus"></i>
              </div>
            </a>
          `;
        });
      } else {
        html = "<p>Không có sản phẩm nào trong danh mục này.</p>";
      }
      rightListFood.innerHTML = html;
      attachCartEvents();
    }

    if (typeLinks && typeLinks.length > 0) {
      typeLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          const type = link.getAttribute("data-type");
          if (type) {
            updateProductList(type);
          }
          e.stopPropagation();
        });
        link.addEventListener("touchstart", (e) => {
          const type = link.getAttribute("data-type");
          if (type) {
            updateProductList(type);
          }
          e.stopPropagation();
        });
      });
    }

    if (searchInput && searchButton) {
      searchButton.addEventListener("click", () => {
        const keyword = searchInput.value.trim().toLowerCase();
        searchProducts(keyword);
      });

      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const keyword = searchInput.value.trim().toLowerCase();
          searchProducts(keyword);
        }
      });

      function searchProducts(keyword) {
        const products = getProducts();
        let foundProducts = [];
        Object.keys(products).forEach((type) => {
          const matchingProducts = products[type]
            .map((product, index) => ({ ...product, type, index }))
            .filter((product) => product.name.toLowerCase().includes(keyword));
          foundProducts = foundProducts.concat(matchingProducts);
        });

        let html = "";
        if (foundProducts.length > 0) {
          foundProducts.forEach((product) => {
            html += `
              <a href="product-detail.html?category=${product.type}&index=${product.index}" class="box">
                <img src="${product.image}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <div class="info">
                  <span>${product.price}</span>
                  <i class="fa-solid fa-cart-plus"></i>
                </div>
              </a>
            `;
          });
        } else {
          html = "<p>Không tìm thấy sản phẩm nào.</p>";
        }
        rightListFood.innerHTML = html;
        attachCartEvents();
      }
    }

    // Hiển thị danh sách mặc định khi tải trang
    updateProductList("traditional-coffee");
  }

  // GỬI LIÊN HỆ
  const btnSend = document.querySelector(".btn-send");
  if (btnSend) {
    btnSend.addEventListener("click", function () {
      const fullname = document.querySelector(".fullname-contact");
      const emailContact = document.querySelector(".email-contact");
      const contentContact = document.querySelector(".content-contact");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !fullname.value.trim() ||
        !emailContact.value.trim() ||
        !contentContact.value.trim()
      ) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
      }
      if (!emailRegex.test(emailContact.value.trim())) {
        alert("Nhập Email đúng định dạng!");
        return;
      }

      const contactData = {
        fullname: fullname.value.trim(),
        email: emailContact.value.trim(),
        content: contentContact.value.trim(),
        timestamp: new Date().toISOString(),
      };

      let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
      contacts.push(contactData);
      localStorage.setItem("contacts", JSON.stringify(contacts));

      alert("Gửi thông tin liên hệ thành công!");

      fullname.value = "";
      emailContact.value = "";
      contentContact.value = "";
    });
  }
});

//
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Loaded");
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
  const index = parseInt(urlParams.get("index"));
  const products = JSON.parse(localStorage.getItem("products")) || {};

  console.log("Category:", category);
  console.log("Index:", index);
  console.log("Products:", products);
  console.log(
    "Selected Product:",
    products[category] && products[category][index]
  );

  let currentProduct = null;

  if (category && products[category] && products[category][index]) {
    const product = products[category][index];
    currentProduct = product;
    console.log("Product Found:", product);

    // Verify DOM elements
    const image = document.getElementById("product-image");
    const name = document.getElementById("product-name");
    const price = document.getElementById("product-price");
    const description = document.getElementById("product-description");
    console.log("DOM Elements:", {
      image,
      name,
      price,
      description,
    });

    // Update DOM
    if (image && name && price && description) {
      image.src = product.image || "https://via.placeholder.com/150";
      image.alt = product.name || "Product Image";
      name.textContent = product.name || "Unknown Product";
      price.textContent = product.price || "N/A";
      description.textContent =
        product.description || "Thông tin: Sản phẩm đang được cập nhật.";
    } else {
      console.error("DOM elements missing!");
      document.querySelector(".product-detail-container").innerHTML =
        "<p class='error-message'>Lỗi: Không tìm thấy các phần tử hiển thị sản phẩm.</p>";
      return;
    }
  } else {
    console.log("Product not found");
    document.querySelector(".product-detail-container").innerHTML =
      "<p class='error-message'>Sản phẩm không tồn tại.</p>";
    return;
  }

  // Quantity Selector
  const quantityInput = document.getElementById("quantity");
  const decreaseBtn = document.getElementById("decrease-quantity");
  const increaseBtn = document.getElementById("increase-quantity");

  decreaseBtn.addEventListener("click", () => {
    let quantity = parseInt(quantityInput.value);
    if (quantity > 1) {
      quantityInput.value = quantity - 1;
    }
  });

  increaseBtn.addEventListener("click", () => {
    let quantity = parseInt(quantityInput.value);
    quantityInput.value = quantity + 1;
  });

  quantityInput.addEventListener("input", () => {
    let quantity = parseInt(quantityInput.value);
    if (isNaN(quantity) || quantity < 1) {
      quantityInput.value = 1;
    }
  });

  // Attach cart event
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const quantity = parseInt(quantityInput.value);
      addToCart(
        currentProduct.name,
        currentProduct.price,
        currentProduct.image,
        quantity
      );
    });
  }

  // Modified addToCart to handle quantity
  let cart = JSON.parse(localStorage.getItem("list-dish")) || [];
  function addToCart(productName, price, imageSrc, quantity) {
    const product = {
      name: productName,
      price,
      image: imageSrc,
      quantity,
    };
    const existingProduct = cart.find((item) => item.name === productName);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.push(product);
    }
    localStorage.setItem("list-dish", JSON.stringify(cart));
    alert(`${productName} (x${quantity}) đã được thêm vào giỏ hàng!`);
  }
});
