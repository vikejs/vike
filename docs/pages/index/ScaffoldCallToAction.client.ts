import './ScaffoldCallToAction.css'

addScaffoldCodeClickHandler()

function addScaffoldCodeClickHandler() {
  document.getElementById('npm-init-code-snippet')!.onclick = async () => {
    if (window.navigator.clipboard) {
      await window.navigator.clipboard.writeText('npm init vike@latest')
    }
    const el = document.getElementById('npm-init-code-snippet')!
    const attr = 'aria-label'
    const originalText = el.getAttribute(attr)!
    el.setAttribute(attr, 'Copied')
    setTimeout(() => {
      el.setAttribute(attr, originalText)
    }, 1200)
  }
}
