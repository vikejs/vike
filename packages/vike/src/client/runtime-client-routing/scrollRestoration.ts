import '../assertEnvClient.js'

export { scrollRestoration_init }
export { scrollRestoration_initialRenderIsDone }

// Using `window.history.scrollRestoration` to recover scroll position when user reloads the page or Cmd-Shift-T back to it.

// We let the browser do it because it's fast.
// - Alternatively we could inject an inline script `<script>scrollTo(history.state.scrollPosition)</script>` early, which seems to be equally fast. (See for example https://vike.dev/usePageContext which sets the main scroll position and the navigation scroll position equally fast.)
// - Firefox doesn't restore the scroll position upon page reload but does upon Cmd-Shift-T

// See also: https://github.com/cyco130/knave/blob/e9e1bc7687848504293197f1b314b7d12ad0d228/design.md#scroll-restoration

import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { onPageHide, onPageShow } from '../../utils/onPageVisibilityChange.js'
const globalObject = getGlobalObject<{ initialRenderIsDone?: true }>('runtime-client-routing/scrollRestoration.ts', {})

function scrollRestoration_init() {
  // Use the native scroll restoration mechanism only for the first render
  scrollRestoration_enable()
  onPageHide(scrollRestoration_enable)
  onPageShow(() => globalObject.initialRenderIsDone && scrollRestoration_disable())
}
function scrollRestoration_initialRenderIsDone() {
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
    // Use the browser's native scroll restoration mechanism
    window.history.scrollRestoration = 'auto'
  }
}
