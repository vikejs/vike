// Code adapted from https://github.com/HenrikJoreteg/internal-nav-helper/blob/5199ec5448d0b0db7ec63cf76d88fa6cad878b7d/src/index.js#L11-L29

export { initOnLinkClick }

import { assert } from './utils.js'
import { skipLink } from './skipLink.js'
import { renderPageClientSide } from './renderPageClientSide.js'
import type { ScrollTarget } from './setScrollPosition.js'

function initOnLinkClick() {
  document.addEventListener('click', onClick)
}
async function onClick(ev: MouseEvent) {
  if (!isNormalLeftClick(ev)) return

  const linkTag = findLinkTag(ev.target as HTMLElement)
  if (!linkTag) return

  const href = linkTag.getAttribute('href')

  if (skipLink(linkTag)) return
  assert(href)
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
