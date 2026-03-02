// ================= API =================
const API_BASE = "https://localhost:7114/api/ManageProduct";

let categories = [];
let products = [];

// ================= FORMAT GIÁ =================
function formatPrice(value) {
  let num = value.replace(/[^\d]/g, "");
  if (!num) return "";
  return parseInt(num).toLocaleString("vi-VN") + " VND";
}

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

// ================= PREVIEW ẢNH =================
function setupImagePreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  if (!input || !preview) return;

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  setupImagePreview("productImage", "previewImage");
  setupImagePreview("editImage", "editPreviewImage");

  handlePriceInput(document.getElementById("productPrice"));
  handlePriceInput(document.getElementById("editPrice"));

  loadCategories();
  loadProducts();
});

// ================= LOAD CATEGORY =================
async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/load-category`);
    if (!res.ok) throw new Error();

    categories = await res.json();

    const addSelect = document.getElementById("productType");
    const editSelect = document.getElementById("editType");

    addSelect.innerHTML = `<option value="" disabled selected>Chọn loại</option>`;
    editSelect.innerHTML = "";

    categories.forEach((c) => {
      addSelect.innerHTML += `<option value="${c.categoryID}">${c.categoryName}</option>`;

      editSelect.innerHTML += `<option value="${c.categoryID}">${c.categoryName}</option>`;
    });
  } catch {
    alert("Không load được category!");
  }
}

// ================= LOAD PRODUCT =================
async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE}/load-product`);
    if (!res.ok) throw new Error();

    products = await res.json();
    renderProducts();
  } catch {
    alert("Không load được sản phẩm!");
  }
}

// ================= RENDER TABLE =================
function renderProducts() {
  const tbody = document.getElementById("productTableBody");
  tbody.innerHTML = "";

  if (!products || products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;padding:40px;">
          Chưa có sản phẩm
        </td>
      </tr>
    `;
    return;
  }

  products.forEach((p, index) => {
    const category = categories.find((c) => c.categoryID === p.categoryID);

    const categoryName = category ? category.categoryName : "Không rõ";

    const statusText =
      p.status === 1
        ? `<span style="color:green;font-weight:600">Đang phục vụ</span>`
        : `<span style="color:red;font-weight:600">Ngưng phục vụ</span>`;

    const lockIcon =
      p.status === 1
        ? `<i class="fas fa-lock-open"></i>`
        : `<i class="fas fa-lock"></i>`;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>
        <img src="https://localhost:7114${p.imageURL}"
        style="width:60px;height:60px;object-fit:cover;border-radius:6px;">
      </td>
      <td>${p.coffeeName}</td>
      <td>${p.price.toLocaleString("vi-VN")} VND</td>
      <td>${categoryName}</td>
      <td>${statusText}</td>
      <td>
        <button onclick="showEditForm(${p.coffeeID})">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="deleteProduct(${p.coffeeID})">
          <i class="fas fa-trash"></i>
        </button>
        <button onclick="lockProduct(${p.coffeeID})">
          ${lockIcon}
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// ================= ADD PRODUCT =================
async function addProduct() {
  const name = document.getElementById("productName").value.trim();
  const priceStr = document.getElementById("productPrice").value;
  const categoryID = parseInt(document.getElementById("productType").value);
  const file = document.getElementById("productImage").files[0];

  if (!name || !priceStr || !categoryID || !file) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  const price = parseInt(priceStr.replace(/[^\d]/g, ""));

  try {
    // 🔥 BƯỚC 1: Upload ảnh trước
    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch(`${API_BASE}/upload-image`, {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) throw new Error("Upload lỗi");

    const uploadData = await uploadRes.json();
    const imageURL = uploadData.imageUrl;

    // 🔥 BƯỚC 2: Lưu product
    const data = {
      coffeeName: name,
      price: price,
      categoryID: categoryID,
      imageURL: imageURL,
    };

    const res = await fetch(`${API_BASE}/add-product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(await res.text());

    alert("Thêm thành công!");
    clearAddForm();
    loadProducts();
  } catch (err) {
    console.error(err);
    alert("Lỗi khi thêm!");
  }
}

// ================= DELETE =================
async function deleteProduct(id) {
  if (!confirm("Bạn chắc chắn muốn xóa?")) return;

  try {
    const res = await fetch(`${API_BASE}/delete-product/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error();

    alert("Đã xóa!");
    loadProducts();
  } catch {
    alert("Lỗi khi xóa!");
  }
}

// ================= SHOW EDIT =================
function showEditForm(id) {
  const product = products.find((p) => p.coffeeID === id);
  if (!product) return;

  document.getElementById("editId").value = product.coffeeID;

  document.getElementById("editName").value = product.coffeeName;

  document.getElementById("editPrice").value =
    product.price.toLocaleString("vi-VN") + " VND";

  document.getElementById("editType").value = product.categoryID;

  document.getElementById("editPreviewImage").src =
  "https://localhost:7114" + product.imageURL;

  document.getElementById("editPreviewImage").style.display = "block";

  document.getElementById("editModal").style.display = "flex";
  document.getElementById("overlay").style.display = "block";
}

// ================= SAVE EDIT =================
async function saveEdit() {
  const id = document.getElementById("editId").value;
  const name = document.getElementById("editName").value.trim();
  const priceStr = document.getElementById("editPrice").value;
  const categoryID = parseInt(document.getElementById("editType").value);
  const file = document.getElementById("editImage").files[0];

  if (!name || !priceStr || !categoryID) {
    alert("Vui lòng nhập đầy đủ!");
    return;
  }

  const price = parseInt(priceStr.replace(/[^\d]/g, ""));
  let imageURL = null;

  try {
    // 🔥 Nếu có chọn ảnh mới → upload trước
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(`${API_BASE}/upload-image`, {
        method: "POST",
        body: formData
      });

      if (!uploadRes.ok) throw new Error("Upload lỗi");

      const uploadData = await uploadRes.json();
      imageURL = uploadData.imageUrl;
    } else {
      // 🔥 Nếu không chọn ảnh mới → giữ ảnh cũ
      const previewSrc = document.getElementById("editPreviewImage").src;

      imageURL = previewSrc.replace("https://localhost:7114", "");
    }

    await updateProduct(id, name, price, categoryID, imageURL);

  } catch (err) {
    console.error(err);
    alert("Lỗi khi cập nhật!");
  }
}

// ================= UPDATE PRODUCT =================
async function updateProduct(id, name, price, categoryID, imageURL) {
  const data = {
    coffeeName: name,
    price: price,
    categoryID: categoryID,
    imageURL: imageURL,
  };

  try {
    const res = await fetch(`${API_BASE}/update-product/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(await res.text());

    alert("Cập nhật thành công!");
    cancelEdit();
    loadProducts();
  } catch {
    alert("Lỗi khi cập nhật!");
  }
}

// ================= UPDATE STATUS =================
async function lockProduct(id) {
  try {
    const res = await fetch(`${API_BASE}/update-status/${id}`, {
      method: "PUT",
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    // const message = await res.text();
    // alert(message);

    loadProducts();
  } catch (error) {
    console.error(error);
    alert("Lỗi khi cập nhật trạng thái!");
  }
}
// ================= CLEAR FORM =================
function clearAddForm() {
  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productImage").value = "";
  document.getElementById("previewImage").src = "";
  document.getElementById("previewImage").style.display = "none";
  document.getElementById("productType").value = "";
}

// ================= CLOSE MODAL =================
function cancelEdit() {
  document.getElementById("editModal").style.display = "none";
  document.getElementById("overlay").style.display = "none";

  document.getElementById("editName").value = "";
  document.getElementById("editPrice").value = "";
  document.getElementById("editImage").value = "";
  document.getElementById("editPreviewImage").src = "";
  document.getElementById("editPreviewImage").style.display = "none";
}
