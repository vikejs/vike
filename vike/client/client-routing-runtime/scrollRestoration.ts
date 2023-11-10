// Handle the browser's native scroll restoration mechanism

export { browserNativeScrollRestoration_disable }
export { setupNativeScrollRestoration }
export { setInitialRenderIsDone }

import { getGlobalObject, onPageHide, onPageShow } from './utils.js'
const globalObject = getGlobalObject<{
  initialRenderIsDone?: true
}>('scrollRestoration.ts', {})

// We use the browser's native scroll restoration mechanism only for the first render
function setupNativeScrollRestoration() {
  browserNativeScrollRestoration_enable()
  onPageHide(browserNativeScrollRestoration_enable)
  onPageShow(() => globalObject.initialRenderIsDone && browserNativeScrollRestoration_disable())
}
function setInitialRenderIsDone() {
  globalObject.initialRenderIsDone = true
}

function browserNativeScrollRestoration_disable() {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }
}
function browserNativeScrollRestoration_enable() {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'auto'
  }
}
