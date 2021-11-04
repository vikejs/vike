import { isExternalLink } from './isExternalLink'

export { skipLink }

function skipLink(linkTag: HTMLElement): boolean {
  const url = linkTag.getAttribute('href')

  if (!url) return true
  if (isExternalLink(url)) return true
  if (isNewTabLink(linkTag)) return true

  return false
}

function isNewTabLink(linkTag: HTMLElement) {
  const target = linkTag.getAttribute('target')
  const rel = linkTag.getAttribute('rel')
  return target === '_blank' || target === '_external' || rel === 'external' || linkTag.hasAttribute('download')
}
