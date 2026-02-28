const API_BASE = "https://localhost:7161/api";

// login.js
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const wrapper = document.querySelector(".wrapper");
const loginTitle = document.querySelector(".title-login");
const registerTitle = document.querySelector(".title-register");
const signUpBtn = document.querySelector("#SignUpBtn");
const signInBtn = document.querySelector("#SignInBtn");

const accountInput = document.querySelector("#log-account");
const passInput = document.querySelector("#log-pass");

// Hàm kiểm tra định dạng email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function loginFunction() {
  loginForm.style.left = "50%";
  loginForm.style.opacity = 1;
  registerForm.style.left = "150%";
  registerForm.style.opacity = 0;
  wrapper.style.height = "500px";
  loginTitle.style.top = "50%";
  loginTitle.style.opacity = 1;
  registerTitle.style.top = "50px";
  registerTitle.style.opacity = 0;
}

function registerFunction() {
  loginForm.style.left = "-50%";
  loginForm.style.opacity = 0;
  registerForm.style.left = "50%";
  registerForm.style.opacity = 1;
  wrapper.style.height = "580px";
  loginTitle.style.top = "-60px";
  loginTitle.style.opacity = 0;
  registerTitle.style.top = "50%";
  registerTitle.style.opacity = 1;
}

// Xử lý đăng ký
signUpBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  const fullName = document.querySelector("#reg-name").value.trim();
  const email = document.querySelector("#reg-email").value.trim();
  const username = document.querySelector("#reg-account").value.trim();
  const password = document.querySelector("#reg-pass").value.trim();
  const agree = document.querySelector("#agree").checked;

  if (!fullName || !email || !username || !password) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  if (!isValidEmail(email)) {
    alert("Email không hợp lệ!");
    return;
  }

  if (!agree) {
    alert("Vui lòng đồng ý điều khoản!");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: username,
        PasswordHash: password,
        FullName: fullName,
        Email: email,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert(data.message || "Đăng ký thành công!");

    registerForm.reset();
    loginFunction();
  } catch (err) {
    console.error(err);
    alert("Không kết nối được server");
  }
});

// ĐĂNG NHẬP
signInBtn.addEventListener("click", async () => {
  const account = accountInput.value.trim();
  const pass = passInput.value.trim();

  if (!account || !pass) {
    alert("Vui lòng nhập tài khoản và mật khẩu");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: account,
        PasswordHash: pass,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.log(err);
      alert("Sai tài khoản hoặc mật khẩu");
      return;
    }

    const data = await res.json();

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("role", data.role);
    localStorage.setItem("user", data.user);

    alert("Đăng nhập thành công");
    window.location.href = "../../index.html";
  } catch (err) {
    console.error(err);
    alert("Không kết nối được server");
  }
});
