const API = "https://localhost:7114/api/ManageStaff";

let editingId = null;

// ================= VALUEDATE =================
function validateStaff(data) {
  if (!data.fullName || data.fullName.trim() === "") {
    alert("Tên nhân viên không được để trống");
    return false;
  }

  if (!data.gender || data.gender === "") {
    alert("Vui lòng chọn giới tính");
    return false;
  }

  if (!data.phone || data.phone.trim() === "") {
    alert("Số điện thoại không được để trống");
    return false;
  }

  if (!/^[0-9]{10}$/.test(data.phone)) {
    alert("Số điện thoại phải gồm 10 số");
    return false;
  }

  if (!data.email || data.email.trim() === "") {
    alert("Email không được để trống");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    alert("Email không hợp lệ");
    return false;
  }

  if (!data.address || data.address.trim() === "") {
    alert("Địa chỉ không được để trống");
    return false;
  }

  if (!data.username || data.username.trim() === "") {
    alert("Tài khoản không được để trống");
    return false;
  }

  if (!data.passwordHash || data.passwordHash.trim() === "") {
    alert("Mật khẩu không được để trống");
    return false;
  }

  return true;
}

// ================= LOAD STAFF =================
document.addEventListener("DOMContentLoaded", () => {
  loadStaff();
});

async function loadStaff() {
  try {
    const res = await fetch(`${API}/load-staff`);
    const data = await res.json();

    const tbody = document.getElementById("staff-list");
    tbody.innerHTML = "";

    data.forEach((s, index) => {
      const statusText = s.status === 1 ? "Hoạt động" : "Ngừng";
      const statusColor = s.status === 1 ? "green" : "red";
      const icon = s.status === 1 ? "fa-toggle-on" : "fa-toggle-off";
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${s.fullName}</td>
          <td>${s.gender}</td>
          <td>${s.address}</td>
          <td>${s.phone}</td>
          <td>${s.email}</td>
          <td>${formatDate(s.createdAt)}</td>
          <td style="color:${statusColor}">${statusText}</td>
          <td>
            <button onclick="openEdit(${s.userID})">
              <i class="fas fa-edit"></i>
            </button>

            <button onclick="changeStatus(${s.userID}, ${s.status})">
              <i class="fas ${icon}"></i>
            </button>

            <button onclick="deleteStaff(${s.userID})">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;

      tbody.innerHTML += row;
    });
  } catch (err) {
    console.log(err);
    alert("Không thể tải danh sách nhân viên");
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("vi-VN");
}

//
// ================= ADD STAFF =====================
//

async function addStaff() {
  const data = {
    username: document.getElementById("staffUsername").value.trim(),
    passwordHash: document.getElementById("staffPassword").value.trim(),
    fullName: document.getElementById("staffName").value.trim(),
    gender: document.getElementById("staffGender").value,
    phone: document.getElementById("staffPhone").value.trim(),
    email: document.getElementById("staffEmail").value.trim(),
    address: document.getElementById("staffAddress").value.trim(),
  };

  if (!validateStaff(data)) return;

  try {
    const res = await fetch(`${API}/add-staff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const message = await res.text();

    if (!res.ok) {
      alert(message);
      return;
    }

    alert(message);
    loadStaff();
  } catch (err) {
    console.log(err);
    alert("Lỗi kết nối server");
  }
}

//
// ================= OPEN EDIT =====================
//

async function openEdit(id) {
  try {
    const res = await fetch(`${API}/detail/${id}`);

    if (!res.ok) {
      const message = await res.text();
      alert(message);
      return;
    }

    const data = await res.json();
    const staff = data[0];

    // lưu id vào hidden input
    document.getElementById("editId").value = staff.userID;

    // mở modal
    document.getElementById("staffModal").style.display = "flex";

    // set dữ liệu
    document.getElementById("editName").value = staff.fullName;
    document.getElementById("editGen").value = staff.gender;
    document.getElementById("editPhone").value = staff.phone;
    document.getElementById("editEmail").value = staff.email;
    document.getElementById("editAddress").value = staff.address;
    document.getElementById("editUsername").value = staff.username;
    document.getElementById("editPassword").value = staff.passwordHash;
  } catch (err) {
    console.log(err);
    alert("Không thể tải thông tin nhân viên");
  }
}

function closeStaffModal() {
  document.getElementById("staffModal").style.display = "none";
}

//
// ================= SAVE EDIT =====================
//

async function saveStaff() {
  const id = document.getElementById("editId").value;

  const data = {
    username: document.getElementById("editUsername").value.trim(),
    passwordHash: document.getElementById("editPassword").value.trim(),
    fullName: document.getElementById("editName").value.trim(),
    gender: document.getElementById("editGen").value,
    phone: document.getElementById("editPhone").value.trim(),
    email: document.getElementById("editEmail").value.trim(),
    address: document.getElementById("editAddress").value.trim(),
  };

  if (!validateStaff(data)) return;

  try {
    const res = await fetch(`${API}/update-staff/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const message = await res.text();

    if (!res.ok) {
      alert(message);
      return;
    }

    alert(message);

    closeStaffModal();
    loadStaff();
  } catch (err) {
    console.log(err);
    alert("Lỗi kết nối server");
  }
}

//
// ================= CHANGE STATUS =================
//

async function changeStatus(id, current) {
  const newStatus = current === 1 ? 0 : 1;

  try {
    const res = await fetch(`${API}/update-status/${id}?status=${newStatus}`, {
      method: "PUT",
    });

    const message = await res.text();

    if (!res.ok) {
      alert(message);
      return;
    }

    alert(message);
    loadStaff();
  } catch (err) {
    console.log(err);
    alert("Không thể cập nhật trạng thái");
  }
}

//
// ================= DELETE STAFF ==================
//

async function deleteStaff(id) {
  if (!confirm("Bạn có chắc muốn xóa nhân viên?")) return;

  try {
    const res = await fetch(`${API}/delete-staff/${id}`, {
      method: "DELETE",
    });

    const message = await res.text();

    if (!res.ok) {
      alert(message);
      return;
    }

    alert(message);
    loadStaff();
  } catch (err) {
    console.log(err);
    alert("Không thể xóa nhân viên");
  }
}
