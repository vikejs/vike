// Handle the browser's native scroll restoration mechanism

export { scrollRestoration_disable }
export { scrollRestoration_init }
export { scrollRestoration_setInitialRenderIsDone }

import { getGlobalObject, onPageHide, onPageShow } from './utils.js'
const globalObject = getGlobalObject<{
  initialRenderIsDone?: true
}>('scrollRestoration.ts', {})

// We use the browser's native scroll restoration mechanism only for the first render
function scrollRestoration_init() {
  scrollRestoration_enable()
  onPageHide(scrollRestoration_enable)
  onPageShow(() => globalObject.initialRenderIsDone && scrollRestoration_disable())
}
function scrollRestoration_setInitialRenderIsDone() {
  globalObject.initialRenderIsDone = true
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
