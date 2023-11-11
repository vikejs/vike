export { setScrollPosition }
export { autoSaveScrollPosition }
export type { ScrollTarget }

import { assert, onPageHide, sleep, throttle } from './utils.js'
import { saveScrollPosition, type ScrollPosition } from './history.js'

type ScrollTarget = ScrollPosition | 'scroll-to-top-or-hash' | 'preserve-scroll'
function setScrollPosition(scrollTarget: ScrollTarget): void {
  if (scrollTarget === 'preserve-scroll') {
    return
  }
  let scrollPosition: ScrollPosition
  if (scrollTarget === 'scroll-to-top-or-hash') {
    const hash = getUrlHash()
    // We replicate the browser's native behavior
    if (hash && hash !== 'top') {
      const hashTarget = document.getElementById(hash) || document.getElementsByName(hash)[0]
      if (hashTarget) {
        hashTarget.scrollIntoView()
        return
      }
    }
    scrollPosition = { x: 0, y: 0 }
  } else {
    assert('x' in scrollTarget && 'y' in scrollTarget)
    scrollPosition = scrollTarget
  }
  setScroll(scrollPosition)
}

/** Change the browser's scoll position, in a way that works during a repaint. */
function setScroll(scrollPosition: ScrollPosition) {
  const scroll = () => window.scrollTo(scrollPosition.x, scrollPosition.y)
  const done = () => window.scrollX === scrollPosition.x && window.scrollY === scrollPosition.y

  // In principle, this `done()` call should force the repaint to be finished. But that doesn't seem to be the case with `Firefox 97.0.1`.
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
      //  - The following strategy is very agressive. It doesn't need to be that aggressive for Firefox. But we do it to be safe.
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
