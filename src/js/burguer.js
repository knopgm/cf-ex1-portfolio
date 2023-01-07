const menuItems = document.querySelectorAll(".navigation-list__item");
const menuCheckboxInput = document.querySelector("#checkInput");

menuItems.forEach((item) => item.addEventListener("click", closeMenu));

function closeMenu() {
  menuCheckboxInput.checked = false;
}
