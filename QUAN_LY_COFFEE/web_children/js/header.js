fetch("header.html")
  .then((response) => {
    if (!response.ok) throw new Error("Không tìm thấy header.html");
    return response.text();
  })
  .then((data) => {
    document.getElementById("main-header").innerHTML = data;
  })
  .catch((error) => console.error("Lỗi fetch:", error));

fetch("footer.html")
  .then((response) => {
    if (!response.ok) throw new Error("Không tìm thấy footer.html");
    return response.text();
  })
  .then((data) => {
    document.getElementById("main-footer").innerHTML = data;
  })
  .catch((error) => console.error("Lỗi fetch:", error));
