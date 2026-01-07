import '../assertEnvClient.js'

export { initOnPopState }

import { onPopStateBegin, type HistoryInfo } from './history.js'
import { renderPageClient } from './renderPageClient.js'
import { type ScrollTarget, setScrollPosition } from './setScrollPosition.js'
import { catchInfiniteLoop } from '../../utils/catchInfiniteLoop.js'
// The 'popstate' event is triggered when the browser doesn't fully load the new URL, for example:
// - `location.hash='#foo'` triggers the popstate event while `location.href='/foo'` doesn't.
// - Clicking on the browser's back-/forward button triggers a popstate event only if the history entry was generated with history.pushState() — no popstate event is fired upon Server Routing.

// Concretely, 'popstate' is fired when:
// 1. Back-/forward navigation:
//    - By the user using the browser's back-/forward navigation
//    - By the app using `history.back()` / `history.forward()` / `history.go()`
//    > Except of history entries triggered by Server Routing, see comment above.
// 2. URL hash changes:
//    - By the user clicking on `<a href="#some-hash">`
//      - The popstate event is *only* triggered if `href` starts with '#' (even if `href==='/foo#bar'` and the current URL has the same pathname '/foo' then popstate isn't triggered)
//      - Vike doesn't intercept hash links (see `isLinkSkipped()`) and let's the browser handle them.
//    - By the app using a `location` API such as `location.hash = 'some-hash'`
//      - Only upon hash navigation: setting `location.href='/foo'` triggers a full page reload and no popstate event is fired.
//      - Also upon `location.href='/foo#bar'` while the current URL is '/foo' (unlike <a> clicks).

// Notes:
// - The 'hashchange' event is fired after popstate, so we cannot use it to distinguish between hash and non-hash navigations.
// - It isn't possible to monkey patch the `location` APIs. (Chrome throws `TypeError: Cannot redefine property` when attempt to overwrite any `location` property.)
// - Text links aren't supported: https://github.com/vikejs/vike/issues/2114
// - docs/ is a good playground to test all this.
// - No 'popstate' event is fired upon Server Routing — when the user clicks on a link before the page's JavaScript loaded.
// - On a pristine page without JavaScript such as https://brillout.com we have `window.history.state === null`.

function initOnPopState() {
  window.addEventListener('popstate', onPopState)
}
async function onPopState() {
  catchInfiniteLoop('onPopState()')
  const res = onPopStateBegin()
  if (res.skip) return
  const { previous, current } = res
  await handleHistoryNavigation(previous, current)
}
async function handleHistoryNavigation(previous: HistoryInfo, current: HistoryInfo) {
  const scrollTarget: ScrollTarget = current.state.vike.scrollPosition || undefined

  const isHashNavigation = removeHash(current.url) === removeHash(previous.url) && current.url !== previous.url
  if (isHashNavigation) {
    // We have to scroll ourselves because we have set `window.history.scrollRestoration = 'manual'`
    setScrollPosition(scrollTarget)
    return
  }

  const isUserPushStateNavigation =
    current.state.vike.triggeredBy === 'user' || previous.state.vike.triggeredBy === 'user'
  const doNotRenderIfSamePage = isUserPushStateNavigation

  const isBackwardNavigation =
    !current.state.vike.timestamp || !previous.state.vike.timestamp
      ? null
      : current.state.vike.timestamp < previous.state.vike.timestamp

  await renderPageClient({ scrollTarget, isBackwardNavigation, doNotRenderIfSamePage, isHistoryNavigation: true })
}

function removeHash(url: `/${string}`) {
  return url.split('#')[0]!
}
