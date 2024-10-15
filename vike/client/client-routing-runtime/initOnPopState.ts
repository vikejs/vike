export { initOnPopState }
export { updateState }

import { assert, getCurrentUrl, getGlobalObject } from './utils.js'
import { enhanceHistoryState, getHistoryState } from './history.js'
import { renderPageClientSide } from './renderPageClientSide.js'
import { type ScrollTarget, setScrollPosition } from './setScrollPosition.js'

const globalObject = getGlobalObject('initOnPopState.ts', { previous: getInfo() })

function initOnPopState() {
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
    const { previous } = globalObject
    const current = getInfo()
    globalObject.previous = current

    const scrollTarget: ScrollTarget = current.state?.scrollPosition || undefined

    const isUserLandPushStateNavigation = current.state?.triggeredBy === 'user'

    const isHashNavigation = removeHash(current.url) === removeHash(previous.url)

    const isBackwardNavigation =
      !current.state?.timestamp || !previous.state?.timestamp
        ? null
        : current.state.timestamp < previous.state.timestamp

    // - `history.state === null` when:
    //   - Click on `<a href="#some-hash" />` (note that Vike's `initOnLinkClick()` handler skips hash links)
    //   - `location.hash = 'some-hash'`
    // - `history.state !== null` when `popstate` was triggered by the user clicking on his browser's forward/backward history button.
    let isHashNavigationNew = isHashNavigation && window.history.state === null
    if (window.history.state === null) {
      assert(isHashNavigation)
      // The browser already scrolled to `#${hash}` => the current scroll position is the right one => we save it with `enhanceHistoryState()`.
      enhanceHistoryState()
      globalObject.previous = getInfo()
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

function getInfo() {
  return {
    url: getCurrentUrl(),
    state: getHistoryState()
  }
}

function removeHash(url: `/${string}`) {
  return url.split('#')[0]!
}

function updateState() {
  globalObject.previous = getInfo()
}
