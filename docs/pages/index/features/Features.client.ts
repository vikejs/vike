import { assert } from 'libframe-docs/utils'

addTwitterWidgets()
addFeatureClickHandlers()

function addTwitterWidgets() {
  loadScript('https://platform.twitter.com/widgets.js')
}

function addFeatureClickHandlers() {
  const featureEls: HTMLElement[] = Array.from(
    document.getElementById('features')!.querySelectorAll('.feature.has-learn-more')
  )
  assert(featureEls.length > 0)

  featureEls.forEach((featureEl) => {
    featureEl.onclick = () => {
      expandLearnMore(featureEl)
    }
  })
}

function expandLearnMore(featureEl: HTMLElement) {
  const featureId = featureEl.id
  assert(featureId.startsWith('feature-'), { featureId })
  const featureName = featureId.slice('feature-'.length)

  const selectedClass = 'selected'
  const learnId = 'learn-more-' + featureName
  const learnEl = document.getElementById(learnId)
  assert(learnEl, { learnId })

  const isExpanded = featureEl.classList.contains(selectedClass)

  if (!isExpanded) {
    const rowEl = featureEl.parentNode as HTMLElement
    if (getComputedStyle(rowEl, 'display') === 'grid') {
      ;[
        ...(rowEl.querySelectorAll('.learn-more') as any as HTMLElement[]),
        ...(rowEl.querySelectorAll('.feature') as any as HTMLElement[])
      ].forEach((el) => {
        el.classList.remove(selectedClass)
      })
    }
  }

  ;[featureEl, learnEl].forEach((el) => {
    el.classList.toggle(selectedClass)
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

function getComputedStyle(el: HTMLElement, styleProp: string) {
  return window.document.defaultView!.getComputedStyle(el).getPropertyValue(styleProp)
}
