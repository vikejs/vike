import '../assertEnvClient.js'

export { setScrollPosition }
export { autoSaveScrollPosition }
export { scrollToHashOrTop }
export type { ScrollTarget }

import { assert } from '../../utils/assert.js'
import { onPageHide } from '../../utils/onPageVisibilityChange.js'
import { sleep } from '../../utils/sleep.js'
import { throttle } from '../../utils/throttle.js'
import { replaceHistoryStateOriginal, saveScrollPosition, type ScrollPosition } from './history.js'

type ScrollTarget = undefined | { preserveScroll: boolean } | ScrollPosition
function setScrollPosition(scrollTarget: ScrollTarget, url?: string): void {
  if (!scrollTarget && url && hasTextFragment(url)) {
    scrollToTextFragment(url)
    return
  }
  if (scrollTarget && 'x' in scrollTarget) {
    setScroll(scrollTarget)
    return
  }
  if (scrollTarget?.preserveScroll) {
    return
  }
  const hash = getUrlHash()
  scrollToHashOrTop(hash)
}

// https://github.com/vikejs/vike/issues/2114
// https://github.com/WICG/scroll-to-text-fragment/issues/261
function scrollToTextFragment(url: string) {
  const stateOriginal = window.history.state as unknown
  replaceHistoryStateOriginal(null, url)
  // We need `history.state===null` before location.replace() so that our 'popstate' handling is correct
  assert((window.history.state as unknown) === null)
  // - Chrome's location.replace() keeps the current state (`history.state===stateOriginal`)
  // - Firefox's location.replace() replaces the current state with `null` (`history.state===null`)
  window.location.replace(url)
  replaceHistoryStateOriginal(stateOriginal, url)
}
function hasTextFragment(url: string) {
  return url.includes('#') && url.includes(':~:text')
}

// Replicates the browser's native behavior
function scrollToHashOrTop(hash: null | string) {
  if (!hash) {
    scrollToTop()
  } else {
    const id = decodeURIComponent(hash)
    const hashTarget = document.getElementById(id) || document.getElementsByName(id)[0]
    if (hashTarget) {
      hashTarget.scrollIntoView()
      // Is this standard? We just copied SvelteKit: https://github.com/sveltejs/kit/blob/94c45b9372a9ed2b80e21cdca3f235c45edaa5b0/packages/kit/src/runtime/client/client.js#L2132
      hashTarget.focus()
    } else if (hash === 'top') {
      scrollToTop()
    }
  }
}
function scrollToTop() {
  setScroll({ x: 0, y: 0 })
}

/**
 * Change the browser's scroll position, in a way that works during a repaint.
 *
 * I don't remember exactly why I implemented this and what I meant with "repaint"
 * - https://github.com/vikejs/vike/commit/fd70fadb0bcea8d922f961f1c88713994e0aaf34
 * - I guess scrolling doesn't work during a page rendering? So we have to re-scroll until the scroll position is correct?
 * - Do other frameworks implement this? SvelteKit doesn't seem to.
 * - Let's remove it and see if users complain?
 */
function setScroll(scrollPosition: ScrollPosition) {
  const scroll = () => {
    // `window.scrollTo()` respects the CSS `scroll-behavior: smooth` property
    window.scrollTo(scrollPosition.x, scrollPosition.y)
  }
  const done = () => {
    return window.scrollX === scrollPosition.x && window.scrollY === scrollPosition.y
  }

  // In principle, this `done()` call should force the repaint to be finished, but that doesn't seem to be the case with `Firefox 97.0.1`.
  if (done()) return
  scroll()

  // Because `done()` doesn't seem to always force the repaint to be finished, we potentially need to retry again.
  if (done()) return
  requestAnimationFrame(() => {
    scroll()
    if (done()) return

    setTimeout(async () => {
      scroll()
      if (done()) return

      // In principle, `requestAnimationFrame() -> setTimeout(, 0)` should be enough.
      //  - https://stackoverflow.com/questions/61281139/waiting-for-repaint-in-javascript
      //  - But it's not enough for `Firefox 97.0.1`.
      //  - The following strategy is very aggressive. It doesn't need to be that aggressive for Firefox. But we do it to be safe.
      const start = new Date().getTime()
      while (true) {
        await sleep(10)
        scroll()
        if (done()) return
        const millisecondsElapsed = new Date().getTime() - start
        if (millisecondsElapsed > 100) return
      }
    }, 0)
  })
}

function getUrlHash(): string | null {
  let { hash } = window.location
  if (hash === '') return null
  assert(hash.startsWith('#'))
  hash = hash.slice(1)
  return hash
}

// Save scroll position (needed for back-/forward navigation)
function autoSaveScrollPosition() {
  // Safari cannot handle more than 100 `history.replaceState()` calls within 30 seconds (https://github.com/vikejs/vike/issues/46)
  window.addEventListener('scroll', throttle(saveScrollPosition, Math.ceil(1000 / 3)), { passive: true })
  onPageHide(saveScrollPosition)
}
