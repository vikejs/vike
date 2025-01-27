export { initOnPopState }
export { onPopState }

import { assertWarning, getGlobalObject } from './utils.js'
import { onPopStateBegin, type HistoryInfo } from './history.js'
import { renderPageClientSide } from './renderPageClientSide.js'
import { type ScrollTarget, setScrollPosition } from './setScrollPosition.js'
import { getCurrentLinkClick } from './initOnLinkClick.js'
import { isSamePageHashLink } from './skipLink.js'
const globalObject = getGlobalObject('initOnPopState.ts', { listeners: [] as Listener[] })

// The 'popstate' event is trigged only upon:
// - Back-/forward navigation:
//   - By the user using the browser's back-/forward navigation
//   - By the app using `history.back()` / `history.forward()` / `history.go()`
// - URL hash changes:
//   - By the user clicking on `<a href="#some-hash" />`
//     - The popstate event is *only* triggered if `href` starts with '#' (if `href==='/some-path#some-hash'` and the current URL has the same pathname '/some-path' then popstate isn't triggered)
//     - Vike skips hash links (see `skipLink()`) and let's the browser handle them.
//   - By the app using a `location` API such as `location.hash = 'some-hash'`
//     - Even upon `location.href='/some-path#some-hash'` while the current URL is '/some-path' (unlike <a> clicks).
//     - Only upon hash navigation: setting `location.href='/some-other-path'` triggers a full page reload and no popstate event is fired.

// Ideally, we should let the browser handle hash changes.
// - A motivation being to support text links (`#:~:text=somePrefix-,someText,-someSuffix`)
//   - https://github.com/vikejs/vike/issues/2114
// - The 'hashchange' event is fired after popstate, so we cannot use it to distinguish between hash and non-hash navigations.
// - It isn't possible to monkey patch the `location` APIs. (Chrome throws `TypeError: Cannot redefine property` when attempt to overwrite any `location` property.)

function initOnPopState() {
  window.addEventListener('popstate', async (): Promise<undefined> => {
    console.log('popstate()')
    const currentLinkClick = getCurrentLinkClick()
    const {
      // - `isNewHistoryEntry === false` <=> back-/forward navigation
      // - `isNewHistoryEntry === true` when:
      //   - Click on `<a href="#some-hash" />`
      //   - Using the `location` API
      isNewHistoryEntry,
      previous,
      current
    } = onPopStateBegin()

    // We use currentLinkClick.href instead of current.url because current.url is missing the text fragment `#:~:text=` (Chrome strips it before the popstate event is fired).
    if (currentLinkClick && isSamePageHashLink(currentLinkClick.href)) {
      // Let the browser handle hash links
      return
    }

    const scrollTarget: ScrollTarget = current.state.scrollPosition || undefined

    const isUserPushStateNavigation = current.state.triggeredBy === 'user' || previous.state.triggeredBy === 'user'

    const isHashNavigation = removeHash(current.url) === removeHash(previous.url) && current.url !== previous.url

    const isBackwardNavigation =
      !current.state.timestamp || !previous.state.timestamp ? null : current.state.timestamp < previous.state.timestamp

    if (isHashNavigation) {
      if (!isNewHistoryEntry) {
        // We have to scroll ourselves because we use `window.history.scrollRestoration = 'manual'`
        //   - Inconsistencies between browsers? For example specification says that setting `window.history.scrollRestoration` only affects the current entry in the session history but this contradicts what people are experiencing in practice.
        //     - Specification: https://html.spec.whatwg.org/multipage/history.html#the-history-interface
        //     - Practice: https://stackoverflow.com/questions/70188241/history-scrollrestoration-manual-doesnt-prevent-safari-from-restoring-scrol
        setScrollPosition(scrollTarget)
      } else {
        // The browser already scrolled to `#${hash}` => the current scroll position is the right one => we saved it with `enhanceHistoryState()`.
      }
      return
    }

    let doNotRenderIfSamePage = isUserPushStateNavigation
    let abort: boolean | undefined | void
    globalObject.listeners.forEach((listener) => {
      abort ||= listener({ previous })
    })
    if (abort) {
      return
    }
    if (abort === false) {
      doNotRenderIfSamePage = false
    }

    await renderPageClientSide({ scrollTarget, isBackwardNavigation, doNotRenderIfSamePage })
  })
}

type Listener = (arg: { previous: HistoryInfo }) => void | boolean
// TODO/eventually: deprecate this onPopState(listener) function and let the user define +onPopState.js instead?
/** Control back-/forward navigation.
 *
 * @experimental
 */
function onPopState(listener: Listener) {
  assertWarning(false, 'onPopState() is experimental', { onlyOnce: true })
  globalObject.listeners.push(listener)
}

function removeHash(url: `/${string}`) {
  return url.split('#')[0]!
}
