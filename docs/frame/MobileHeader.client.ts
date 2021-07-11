activateMenuToggle()

function activateMenuToggle() {
  const menuToggle = document.getElementById('menu-toggle')!
  const panelLeft = document.getElementById('panel-left')!
  menuToggle.onclick = () => {
    panelLeft.classList.toggle('show-menu')
  }
}
