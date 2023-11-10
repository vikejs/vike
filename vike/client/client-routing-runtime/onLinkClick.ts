export { onLinkClick }

// Code adapted from https://github.com/HenrikJoreteg/internal-nav-helper/blob/5199ec5448d0b0db7ec63cf76d88fa6cad878b7d/src/index.js#L11-L29

import { assert } from './utils.js'
import { skipLink } from './skipLink.js'
import { renderPageClientSide } from './renderPageClientSide.js'

function onLinkClick() {
  document.addEventListener('click', handler)
}

function handler(ev: MouseEvent) {
  if (!isNormalLeftClick(ev)) return

  const linkTag = findLinkTag(ev.target as HTMLElement)
  if (!linkTag) return

  const url = linkTag.getAttribute('href')

  if (skipLink(linkTag)) return
  assert(url)
  ev.preventDefault()

  const keepScrollPosition = ![null, 'false'].includes(linkTag.getAttribute('keep-scroll-position'))

  const scrollTarget = keepScrollPosition ? 'preserve-scroll' : 'scroll-to-top-or-hash'
  renderPageClientSide({
    scrollTarget,
    urlOriginal: url,
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
