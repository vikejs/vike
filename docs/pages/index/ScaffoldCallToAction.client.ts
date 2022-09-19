import './ScaffoldCallToAction.css'

addScaffoldCodeClickHandler()

function addScaffoldCodeClickHandler() {
  document.getElementById('npm-init-code-snippet')!.onclick = async () => {
    if (window.navigator.clipboard) {
      await window.navigator.clipboard.writeText('npm init vite-plugin-ssr@latest')
    }
    const el = document.getElementById('npm-init-code-snippet')!
    const attr = 'aria-label'
    const orignalText = el.getAttribute(attr)!
    el.setAttribute(attr, 'Copied')
    setTimeout(() => {
      el.setAttribute(attr, orignalText)
    }, 1200)
  }
}
