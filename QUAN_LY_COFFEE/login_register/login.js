// login.js
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const wrapper = document.querySelector(".wrapper");
const loginTitle = document.querySelector(".title-login");
const registerTitle = document.querySelector(".title-register");
const signUpBtn = document.querySelector("#SignUpBtn");
const signInBtn = document.querySelector("#SignInBtn");

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
signUpBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const username = document.querySelector("#reg-name").value;
  const email = document.querySelector("#reg-email").value;
  const password = document.querySelector("#reg-pass").value;
  const agree = document.querySelector("#agree").checked;

  // Kiểm tra các trường bắt buộc
  if (!username || !email || !password) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  // Kiểm tra định dạng email
  if (!isValidEmail(email)) {
    alert("Vui lòng nhập email hợp lệ!");
    return;
  }

  // Kiểm tra checkbox terms & conditions
  if (!agree) {
    alert("Vui lòng đồng ý với các điều khoản và điều kiện!");
    return;
  }

  // Lấy danh sách users từ localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Kiểm tra email đã tồn tại
  if (users.some((user) => user.email === email)) {
    alert("Email đã được đăng ký!");
    return;
  }

  // Tạo object user mới
  const newUser = {
    username: username,
    email: email,
    password: password,
  };

  // Thêm user mới vào danh sách
  users.push(newUser);

  // Lưu vào localStorage
  localStorage.setItem("users", JSON.stringify(users));

  alert("Đăng ký thành công! Vui lòng đăng nhập.");

  // Reset form và chuyển sang form login
  registerForm.reset();
  loginFunction();
});

// Xử lý đăng nhập
signInBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const email = document.querySelector("#log-email").value;
  const password = document.querySelector("#log-pass").value;

  // Kiểm tra các trường bắt buộc
  if (!email || !password) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  // Kiểm tra định dạng email
  if (!isValidEmail(email)) {
    alert("Vui lòng nhập email hợp lệ!");
    return;
  }

  // Lấy danh sách users từ localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Kiểm tra thông tin đăng nhập
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    // Lưu thông tin user đã đăng nhập vào localStorage
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert(`Đăng nhập thành công! Chào mừng ${user.username}`);
    loginForm.reset();
    window.location.href = "../index.html";
  } else {
    alert("Email hoặc mật khẩu không đúng!");
  }
});
