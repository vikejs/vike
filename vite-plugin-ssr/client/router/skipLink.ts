export { skipLink }
export { isClientSideRenderable } from './skipLink/isClientSideRenderable'

import { getBaseServer } from '../getBaseServer'
import { assert, parseUrl, isBaseServer, isParsable, isExternalLink } from './utils'

function skipLink(linkTag: HTMLElement): boolean {
  const url = linkTag.getAttribute('href')

  if (url === null) return true
  if (url === '') return true
  if (isExternalLink(url)) return true
  if (isNewTabLink(linkTag)) return true
  if (isHashUrl(url)) return true
  if (!hasBaseServer(url)) {
    return true
  }
  if (!isParsable(url)) {
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
function hasBaseServer(url: string): boolean {
  const baseServer = getBaseServer()
  assert(isBaseServer(baseServer))
  const { hasBaseServer } = parseUrl(url, baseServer)
  return hasBaseServer
}
