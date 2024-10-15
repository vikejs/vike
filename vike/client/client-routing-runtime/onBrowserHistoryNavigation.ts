export { onBrowserHistoryNavigation }
export { updateState }

import { assert, getCurrentUrl, getGlobalObject } from './utils.js'
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
  //     - Click on `<a href="#some-hash" />`
  //       - The popstate event is *only* triggered if `href` starts with '#' (even if `href` is '/#some-hash' while the current URL's pathname is '/' then the popstate still isn't triggered)
  //     - `location.hash = 'some-hash'`
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

    // - `history.state === null` when:
    //   - Click on `<a href="#some-hash" />` (note that Vike's `initOnLinkClick()` handler skips hash links)
    //   - `location.hash = 'some-hash'`
    // - `history.state !== null` when `popstate` was triggered by the user clicking on his browser's forward/backward history button.
    let isHashNavigationNew = isHashNavigation && window.history.state === null
    if (window.history.state === null) {
      assert(isHashNavigation)
      // The browser already scrolled to `#${hash}` => the current scroll position is the right one => we save it with `enhanceHistoryState()`.
      enhanceHistoryState()
      globalObject.previousState = getState()
    }

    // We have to scroll ourselves because we use `window.history.scrollRestoration = 'manual'`. So far this seems to work. Alternatives in case it doesn't work:
    // - Alternative: we use `window.history.scrollRestoration = 'auto'`
    //   - Problem: I don't think it's possbible to set `window.history.scrollRestoration = 'auto'` only for hash navigation and not for non-hash navigations?
    //   - Problem: inconsistencies between browsers? For example specification says that setting `window.history.scrollRestoration` only affects the current entry in the session history but this contradicts what people are experiencing in practice.
    //     - Specification: https://html.spec.whatwg.org/multipage/history.html#the-history-interface
    //     - Practice: https://stackoverflow.com/questions/70188241/history-scrollrestoration-manual-doesnt-prevent-safari-from-restoring-scrol
    // - Alternative: we completely take over hash navigation and reproduce the browser's native behavior upon hash navigation.
    //   - By using the `hashchange` event.
    //   - Problem: conflict if user wants to override the browser's default behavior? E.g. for smooth scrolling, or when using hashes for saving states of some fancy animations.
    if (isHashNavigation && !isUserLandPushStateNavigation) {
      if (!isHashNavigationNew) {
        setScrollPosition(scrollTarget)
      }
      return
    }

    await renderPageClientSide({ scrollTarget, isBackwardNavigation, isUserLandPushStateNavigation })
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
