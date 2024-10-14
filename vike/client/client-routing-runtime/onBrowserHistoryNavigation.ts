export { onBrowserHistoryNavigation }
export { updateState }

import { getCurrentUrl, getGlobalObject } from './utils.js'
import { enhanceHistoryState, getHistoryState } from './history.js'
import { renderPageClientSide } from './renderPageClientSide.js'
import { type ScrollTarget, setScrollPosition } from './setScrollPosition.js'

const globalObject = getGlobalObject('onBrowserHistoryNavigation.ts', { previousState: getState() })

function onBrowserHistoryNavigation() {
  // - The popstate event is trigged upon:
  //   - Back-/forward navigation.
  //     - By user clicking on his browser's back-/forward navigation (or using a shortcut)
  //     - By JavaScript: `history.back()` / `history.forward()`
  //   - URL hash change.
  //     - By user clicking on a hash link `<a href="#some-hash" />`
  //       - The popstate event is *only* triggered if `href` starts with '#' (even if `href` is '/#some-hash' while the current URL's pathname is '/' then the popstate still isn't triggered)
  //     - By JavaScript: `location.hash = 'some-hash'`
  // - The `event` argument of `window.addEventListener('popstate', (event) => /*...*/)` is useless: the History API doesn't provide the previous state (the popped state), see https://stackoverflow.com/questions/48055323/is-history-state-always-the-same-as-popstate-event-state
  window.addEventListener('popstate', async (): Promise<undefined> => {
    const { previousState } = globalObject
    const currentState = getState()
    globalObject.previousState = currentState

    const scrollTarget: ScrollTarget = currentState.historyState?.scrollPosition || undefined

    const isUserLandPushStateNavigation = currentState.historyState?.triggeredBy === 'user'

    const isHashNavigation = currentState.urlWithoutHash === previousState.urlWithoutHash

    const isBackwardNavigation =
      !currentState.historyState?.timestamp || !previousState.historyState?.timestamp
        ? null
        : currentState.historyState.timestamp < previousState.historyState.timestamp

    if (isHashNavigation && !isUserLandPushStateNavigation) {
      // - `history.state` is uninitialized (`null`) when:
      //   - The user's code runs `window.location.hash = '#section'`.
      //   - The user clicks on an anchor link `<a href="#section">Section</a>` (because Vike's `initOnLinkClick()` handler skips hash links).
      // - Alternatively, we completely take over hash navigation and reproduce the browser's native behavior upon hash navigation.
      //   - Problem: we cannot intercept `window.location.hash = '#section'`. (Or maybe we can with the `hashchange` event?)
      //   - Other potential problem: would there be a conflict when the user wants to override the browser's default behavior? E.g. for smooth scrolling, or when using hashes for saving states of some fancy animations.
      // - Another alternative: we use the browser's scroll restoration mechanism (see `browserNativeScrollRestoration_enable()` below).
      //   - Problem: not clear when to call `browserNativeScrollRestoration_disable()`/`browserNativeScrollRestoration_enable()`
      //   - Other potential problem are inconsistencies between browsers: specification says that setting `window.history.scrollRestoration` only affects the current entry in the session history. But this seems to contradict what folks saying.
      //     - Specification: https://html.spec.whatwg.org/multipage/history.html#the-history-interface
      //     - https://stackoverflow.com/questions/70188241/history-scrollrestoration-manual-doesnt-prevent-safari-from-restoring-scrol
      if (window.history.state === null) {
        // The browser already scrolled to `#${hash}` => the current scroll position is the right one => we save it with `enhanceHistoryState()`.
        enhanceHistoryState()
        globalObject.previousState = getState()
      } else {
        // If `history.state !== null` then it means that `popstate` was triggered by the user clicking on his browser's forward/backward history button.
        setScrollPosition(scrollTarget)
      }
    } else {
      await renderPageClientSide({ scrollTarget, isBackwardNavigation, isUserLandPushStateNavigation })
    }
  })
}

function getState() {
  return {
    urlWithoutHash: getCurrentUrl({ withoutHash: true }),
    historyState: getHistoryState()
  }
}

function updateState() {
  globalObject.previousState = getState()
}
