// products lưu dạng { type: [ {id, name, price, image (base64), stock} ] }
let products = JSON.parse(localStorage.getItem("products")) || {};
let editingType = null;
let editingIndex = null;

// Format giá: chỉ số + "VND", dấu chấm phân cách
function formatPrice(value) {
  let num = value.replace(/[^\d]/g, "");
  if (!num) return "";
  return parseInt(num).toLocaleString("vi-VN") + "VND";
}

// Xử lý input giá realtime
function handlePriceInput(input) {
  input.addEventListener("input", (e) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    e.target.value = raw ? formatPrice(raw) : "";
  });
  input.addEventListener("blur", (e) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    e.target.value = raw ? formatPrice(raw) : "";
  });
}

// Preview ảnh khi chọn file
function setupImagePreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!input || !preview) return;

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  displayProducts();

  // Setup preview cho form add
  setupImagePreview("productImage", "previewImage");

  // Setup preview cho form edit
  setupImagePreview("editImage", "editPreviewImage");

  // Format giá cho cả 2 input
  handlePriceInput(document.getElementById("productPrice"));
  handlePriceInput(document.getElementById("editPrice"));
});

// Thêm sản phẩm mới
function addProduct() {
  const name = document.getElementById("productName").value.trim();
  const priceStr = document.getElementById("productPrice").value;
  const stock = parseInt(document.getElementById("productStock").value);
  const type = document.getElementById("productType").value;
  const file = document.getElementById("productImage").files[0];
  const image = file ? document.getElementById("previewImage").src : "";

  const price = priceStr ? formatPrice(priceStr) : "";

  if (!name || !price || !image || isNaN(stock) || !type) {
    alert("Vui lòng điền đầy đủ thông tin và chọn ảnh!");
    return;
  }

  if (!products[type]) products[type] = [];
  products[type].push({ name, price, image, stock });

  localStorage.setItem("products", JSON.stringify(products));
  displayProducts();
  clearAddForm();
}

// Xóa form add sau khi thêm
function clearAddForm() {
  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productImage").value = "";
  document.getElementById("previewImage").src = "";
  document.getElementById("previewImage").style.display = "none";
  document.getElementById("productStock").value = "";
  document.getElementById("productType").value = "";
}

// Hiển thị danh sách (render vào tbody)
function displayProducts() {
  const tbody = document.getElementById("productTableBody");
  if (!tbody) return;

  tbody.innerHTML = ""; // Xóa cũ

  let stt = 1;
  let hasProduct = false;

  for (const type in products) {
    products[type].forEach((product, index) => {
      hasProduct = true;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${stt++}</td>
        <td><img src="${product.image}" alt="${product.name}" style="width:60px; height:60px; object-fit:cover; border-radius:6px;"></td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>${type}</td>
        <td>
          <button class="btn-action" onclick="showEditForm('${type}', ${index})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-action" onclick="deleteProduct('${type}', ${index})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  if (!hasProduct) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:40px; color:#8d6e63;">Chưa có món nào trong menu</td></tr>`;
  }
}

// Xóa sản phẩm
function deleteProduct(type, index) {
  if (confirm("Bạn chắc chắn muốn xóa món này?")) {
    products[type].splice(index, 1);
    if (products[type].length === 0) delete products[type];
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
  }
}

// Mở modal sửa
function showEditForm(type, index) {
  const product = products[type][index];
  editingType = type;
  editingIndex = index;

  document.getElementById("editName").value = product.name;
  document.getElementById("editPrice").value = product.price;
  document.getElementById("editPreviewImage").src = product.image;
  document.getElementById("editPreviewImage").style.display = "block";
  document.getElementById("editStock").value = product.stock;
  document.getElementById("editType").value = type;

  document.getElementById("editModal").style.display = "flex";
  document.getElementById("overlay").style.display = "block";
}

// Lưu sửa
function saveEdit() {
  const name = document.getElementById("editName").value.trim();
  const priceStr = document.getElementById("editPrice").value;
  const stock = parseInt(document.getElementById("editStock").value);
  const newType = document.getElementById("editType").value;
  const file = document.getElementById("editImage").files[0];
  let image = file
    ? document.getElementById("editPreviewImage").src
    : products[editingType][editingIndex].image;

  const price = priceStr ? formatPrice(priceStr) : "";

  if (!name || !price || isNaN(stock) || !newType) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  const updatedProduct = { name, price, image, stock };

  if (newType !== editingType) {
    // Chuyển loại → xóa cũ, thêm mới
    products[editingType].splice(editingIndex, 1);
    if (products[editingType].length === 0) delete products[editingType];
    if (!products[newType]) products[newType] = [];
    products[newType].push(updatedProduct);
  } else {
    products[editingType][editingIndex] = updatedProduct;
  }

  localStorage.setItem("products", JSON.stringify(products));
  displayProducts();
  cancelEdit();
}

// Đóng modal sửa
function cancelEdit() {
  document.getElementById("editModal").style.display = "none";
  document.getElementById("overlay").style.display = "none";
  document.getElementById("editName").value = "";
  document.getElementById("editPrice").value = "";
  document.getElementById("editImage").value = "";
  document.getElementById("editPreviewImage").src = "";
  document.getElementById("editPreviewImage").style.display = "none";
  document.getElementById("editStock").value = "";
  document.getElementById("editType").value = "";
  editingType = null;
  editingIndex = null;
}
