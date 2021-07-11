activateMenuToggle()

function activateMenuToggle() {
  const menuToggle = document.getElementById('menu-toggle')!
  const navigationContainer = document.getElementById('navigation-container')!
  menuToggle.onclick = () => {
    navigationContainer.classList.toggle('show-menu')
  }
}
