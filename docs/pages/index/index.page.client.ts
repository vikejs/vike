import { assert } from '../../utils'
import '../../frame/_default.page.client'
import './importAssets'

addTwitterWidgets()
addScaffoldCodeClickHandler()
addClickHandlerForFeatureExpansion()

function addTwitterWidgets() {
  loadScript('https://platform.twitter.com/widgets.js')
}

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

function addClickHandlerForFeatureExpansion() {
  const featureEls: HTMLElement[] = Array.from(
    document.getElementById('features')!.querySelectorAll('.feature.has-learn-more')
  )
  assert(featureEls.length > 0)

  featureEls.forEach((featureEl) => {
    const featureId = featureEl.id
    assert(featureId.startsWith('feature-'))
    const name = featureId.slice('feature-'.length)
    featureEl.onclick = () => {
      const selected = 'selected'
      const learnId = 'learn-more-' + name
      const learnEl = document.getElementById(learnId)
      assert(learnEl)
      const learnEls: HTMLElement[] = [
        ...(document.querySelectorAll('.learn-more') as any),
        ...(document.querySelectorAll('.feature') as any)
      ]
      learnEls.forEach((el) => {
        if (el.id === learnId || el.id === featureId) {
          el.classList.toggle(selected)
        } else {
          // el.classList.remove(selected)
        }
      })
      // updateSidePanelScroll()
    }
  })
}

function loadScript(scriptUrl: string): void {
  assert(scriptUrl.startsWith('https://'))
  const scriptEl = document.createElement('script')
  scriptEl.src = scriptUrl
  scriptEl.async = true
  scriptEl.setAttribute('charset', 'utf-8')
  document.getElementsByTagName('head')[0].appendChild(scriptEl)
}
