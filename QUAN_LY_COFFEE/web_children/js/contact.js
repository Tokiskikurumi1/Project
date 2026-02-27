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
