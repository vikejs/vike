export { skipLink }

import { parseUrl, assertBaseUrl, isParsable, getBaseUrl, isExternalLink } from './utils'
import { isClientSideRenderable } from './skipLink/isClientSideRenderable'

async function skipLink(linkTag: HTMLElement): Promise<boolean> {
  const url = linkTag.getAttribute('href')

  if (url === null) return true
  if (url === '') return true
  if (isExternalLink(url)) return true
  if (isNewTabLink(linkTag)) return true
  if (isHashUrl(url)) return true
  if (!hasBaseUrl(url)) {
    return true
  }
  if (!isParsable(url)) {
    return true
  }
  if (!(await isClientSideRenderable(url))) {
    return true
  }

  return false
}

function isNewTabLink(linkTag: HTMLElement) {
  const target = linkTag.getAttribute('target')
  const rel = linkTag.getAttribute('rel')
  return target === '_blank' || target === '_external' || rel === 'external' || linkTag.hasAttribute('download')
}
function isHashUrl(url: string) {
  if (url.startsWith('#')) {
    return true
  }
  const removeHash = (url: string) => url.split('#')[0]
  if (url.includes('#') && removeHash(url) === removeHash(window.location.href)) {
    return true
  }
  return false
}
function hasBaseUrl(url: string): boolean {
  const baseUrl = getBaseUrl()
  assertBaseUrl(baseUrl)
  const { hasBaseUrl } = parseUrl(url, baseUrl)
  return hasBaseUrl
}
