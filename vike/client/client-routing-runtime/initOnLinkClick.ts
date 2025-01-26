// Code adapted from https://github.com/HenrikJoreteg/internal-nav-helper/blob/5199ec5448d0b0db7ec63cf76d88fa6cad878b7d/src/index.js#L11-L29

export { initOnLinkClick }
export { getCurrentLinkClick }

import { getGlobalObject } from './utils.js'
import { isSameAsCurrentUrl, skipLink } from './skipLink.js'
import { renderPageClientSide } from './renderPageClientSide.js'
import { scrollToHashOrTop, type ScrollTarget } from './setScrollPosition.js'
const globalObject = getGlobalObject<{ currentLinkClick?: { href: string } }>('initOnLinkClick.ts', {})

function initOnLinkClick() {
  document.addEventListener('click', onClick)
}
async function onClick(ev: MouseEvent) {
  if (!isNormalLeftClick(ev)) return

  const linkTag = findLinkTag(ev.target as HTMLElement)
  if (!linkTag) return

  const href = linkTag.getAttribute('href')
  if (href === null) return

  globalObject.currentLinkClick = { href }
  setTimeout(() => {
    delete globalObject.currentLinkClick
  }, 0)

  // Workaround for Firefox bug: clicking on a hash link that doesn't change the current URL causes Firefox to erroneously set `window.history.state = null` without firing any signal that we can detect.
  // - https://github.com/vikejs/vike/issues/1962
  // - https://github.com/sveltejs/kit/issues/8725
  if (href.includes('#') && isSameAsCurrentUrl(href)) {
    // Prevent Firefox from setting `window.history.state` to `null`
    ev.preventDefault()
    // Replicate the browser's native behavior
    scrollToHashOrTop(href.split('#')[1]!)
    return
  }

  if (skipLink(linkTag)) return
  ev.preventDefault()

  let scrollTarget: ScrollTarget
  {
    const v = linkTag.getAttribute('keep-scroll-position')
    if (v !== null) scrollTarget = { preserveScroll: v === 'false' ? false : true }
  }
  await renderPageClientSide({
    scrollTarget,
    urlOriginal: href,
    isBackwardNavigation: false
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

function getCurrentLinkClick() {
  return globalObject.currentLinkClick
}
