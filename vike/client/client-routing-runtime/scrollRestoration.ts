export { scrollRestoration_init }
export { scrollRestoration_disable }
export { scrollRestoration_setInitialRenderIsDone }

// Handle `window.history.scrollRestoration`
// Explanation: https://github.com/cyco130/knave/blob/e9e1bc7687848504293197f1b314b7d12ad0d228/design.md#scroll-restoration

import { getGlobalObject, onPageHide, onPageShow } from './utils.js'
const globalObject = getGlobalObject<{ initialRenderIsDone?: true }>('scrollRestoration.ts', {})

// We use the browser's native scroll restoration mechanism only for the first render
function scrollRestoration_init() {
  scrollRestoration_enable()
  onPageHide(scrollRestoration_enable)
  onPageShow(() => globalObject.initialRenderIsDone && scrollRestoration_disable())
}
function scrollRestoration_setInitialRenderIsDone() {
  globalObject.initialRenderIsDone = true
  scrollRestoration_disable()
}

function scrollRestoration_disable() {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }
}
function scrollRestoration_enable() {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'auto'
  }
}
