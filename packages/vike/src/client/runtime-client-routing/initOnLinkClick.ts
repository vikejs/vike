import '../assertEnvClient.js'

export { initOnLinkClick }

import { isLinkIgnored, isHrefCurrentUrl, isLinkSkipped } from './isLinkSkipped.js'
import { renderPageClient } from './renderPageClient.js'
import { scrollToHashOrTop, type ScrollTarget } from './setScrollPosition.js'

function initOnLinkClick() {
  document.addEventListener('click', onLinkClick)
}
async function onLinkClick(ev: MouseEvent) {
  if (!isNormalLeftClick(ev)) return

  const linkTag = findLinkTag(ev.target as HTMLElement)
  if (!linkTag) return

  const href = linkTag.getAttribute('href')
  if (href === null) return

  if (isLinkIgnored(linkTag)) return

  // Workaround for Firefox bug: clicking on a hash link that doesn't change the current URL causes Firefox to erroneously set `window.history.state = null` without firing any signal that we can detect.
  // - https://github.com/vikejs/vike/issues/1962
  // - https://github.com/sveltejs/kit/issues/8725
  if (href.includes('#') && isHrefCurrentUrl(href)) {
    // Prevent Firefox from setting `window.history.state` to `null`
    ev.preventDefault()
    // Replicate the browser's native behavior
    scrollToHashOrTop(href.split('#')[1]!)
    return
  }

  if (isLinkSkipped(linkTag)) return
  ev.preventDefault()

  let scrollTarget: ScrollTarget
  {
    const v = linkTag.getAttribute('keep-scroll-position')
    if (v !== null) scrollTarget = { preserveScroll: v === 'false' ? false : true }
  }
  await renderPageClient({
    scrollTarget,
    urlOriginal: href,
  })
}

function isNormalLeftClick(ev: MouseEvent): boolean {
  return ev.button === 0 && !ev.ctrlKey && !ev.shiftKey && !ev.altKey && !ev.metaKey
}

function findLinkTag(target: HTMLElement): null | HTMLElement {
  while (target.tagName !== 'A') {
    const { parentNode } = target
    if (!parentNode) {
      return null
    }
    target = parentNode as HTMLElement
  }
  return target
}
