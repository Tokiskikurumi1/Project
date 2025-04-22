// Lấy danh sách sản phẩm từ LocalStorage hoặc khởi tạo mặc định
let products = JSON.parse(localStorage.getItem("products")) || {};

let editingType = null;
let editingIndex = null;

// Hàm định dạng giá với dấu chấm và thêm "VND"
function formatPrice(value) {
  // Loại bỏ ký tự không phải số để xử lý
  let num = value.replace(/[^\d]/g, "");
  if (!num) return "";
  // Định dạng số với dấu chấm ngăn cách phần nghìn
  num = parseInt(num).toLocaleString("vi-VN");
  return num + "VND";
}

// Hàm xử lý input giá trong thời gian thực
function handlePriceInput(inputElement) {
  inputElement.addEventListener("input", (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, ""); // Chỉ giữ số
    if (rawValue) {
      e.target.value = formatPrice(rawValue);
    } else {
      e.target.value = ""; // Nếu không có số, để trống
    }
  });
  // Thêm sự kiện blur để định dạng khi người dùng rời ô nhập
  inputElement.addEventListener("blur", (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    if (rawValue) {
      e.target.value = formatPrice(rawValue);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  displayProducts();

  const imageInput = document.getElementById("productImage");
  const previewImage = document.getElementById("previewImage");
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  const editImageInput = document.getElementById("editImage");
  const editPreviewImage = document.getElementById("editPreviewImage");
  editImageInput.addEventListener("change", () => {
    const file = editImageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        editPreviewImage.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Xử lý input giá cho form thêm sản phẩm
  const productPriceInput = document.getElementById("productPrice");
  handlePriceInput(productPriceInput);

  // Xử lý input giá cho form sửa sản phẩm
  const editPriceInput = document.getElementById("editPrice");
  handlePriceInput(editPriceInput);
});

function addProduct() {
  const name = document.getElementById("productName").value;
  let price = document.getElementById("productPrice").value; // Lấy giá trị từ input
  const imageInput = document.getElementById("productImage");
  const stock = parseInt(document.getElementById("productStock").value);
  const type = document.getElementById("productType").value;
  const image = imageInput.files[0]
    ? document.getElementById("previewImage").src
    : "";

  // Định dạng lại giá trước khi lưu
  price = formatPrice(price);

  if (name && price && image && !isNaN(stock) && type) {
    if (!products[type]) products[type] = [];
    products[type].push({ name, price, image, stock });
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
    clearForm();
  } else {
    alert("Vui lòng điền đầy đủ thông tin và chọn ảnh!");
  }
}

function displayProducts() {
  const table = document.querySelector(".table-list");
  table.innerHTML = `
    <tr>
      <th>STT</th>
      <th>Hình ảnh</th>
      <th>Tên món</th>
      <th>Giá</th>
      <th>Tồn kho</th>
      <th>Tùy chỉnh</th>
    </tr>
  `;

  let stt = 1;
  for (const type in products) {
    products[type].forEach((product, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${stt++}</td>
        <td><img src="${product.image}" alt="${
        product.name
      }" style="width: 50px; height: 50px;"></td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>
          <button onclick="showEditForm('${type}', ${index})">Sửa</button>
          <button onclick="deleteProduct('${type}', ${index})">Xóa</button>
        </td>
      `;
      table.appendChild(row);
    });
  }
}

//BUTTON XÓA SẢN PHẨM
function deleteProduct(type, index) {
  products[type].splice(index, 1);
  if (products[type].length === 0) delete products[type];
  localStorage.setItem("products", JSON.stringify(products));
  displayProducts();
}

//BUTTON SỬA SẢN PHẨM
function showEditForm(type, index) {
  const product = products[type][index];
  editingType = type;
  editingIndex = index;

  document.getElementById("editName").value = product.name;
  document.getElementById("editPrice").value = product.price; // Giữ nguyên định dạng
  document.getElementById("editPreviewImage").src = product.image;
  document.getElementById("editStock").value = product.stock;
  document.getElementById("editType").value = type;
  document.getElementById("overlay").style.display = "block";
  document.getElementById("editForm").style.display = "block";
}

//BUTTON LƯU SỬA SẢN PHẨM
function saveEdit() {
  const name = document.getElementById("editName").value;
  let price = document.getElementById("editPrice").value; // Lấy giá trị từ input
  const imageInput = document.getElementById("editImage");
  const stock = parseInt(document.getElementById("editStock").value);
  const type = document.getElementById("editType").value;
  const image = imageInput.files[0]
    ? document.getElementById("editPreviewImage").src
    : products[editingType][editingIndex].image;

  // Định dạng lại giá trước khi lưu
  price = formatPrice(price);

  if (name && price && !isNaN(stock) && type) {
    if (type !== editingType) {
      const product = products[editingType][editingIndex];
      products[editingType].splice(editingIndex, 1);
      if (products[editingType].length === 0) delete products[editingType];
      if (!products[type]) products[type] = [];
      products[type].push({ name, price, image, stock });
    } else {
      products[editingType][editingIndex] = { name, price, image, stock };
    }
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
    cancelEdit();
  } else {
    alert("Vui lòng điền đầy đủ thông tin!");
  }
}

function cancelEdit() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("editForm").style.display = "none";
  document.getElementById("editName").value = "";
  document.getElementById("editPrice").value = "";
  document.getElementById("editImage").value = "";
  document.getElementById("editPreviewImage").src = "";
  document.getElementById("editStock").value = "";
  editingType = null;
  editingIndex = null;
}

function clearForm() {
  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productImage").value = "";
  document.getElementById("previewImage").src = "";
  document.getElementById("previewImage").style.display = "none";
  document.getElementById("productStock").value = "";
}
