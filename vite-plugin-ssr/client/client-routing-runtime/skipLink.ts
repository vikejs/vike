export { skipLink }
export { isClientSideRoutable } from './skipLink/isClientSideRoutable.js'

import { getBaseServer } from './getBaseServer.js'
import { isExternalLink } from './isExternalLink.js'
import { assert, parseUrl, isBaseServer, isParsable } from './utils.js'
import { isDisableAutomaticLinkInterception } from './useClientRouter.js'

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
  // Purposely last because disableAutomaticLinkInterception will be removed in the major release
  if (!isVikeLink(linkTag)) return true
  return false
}

// TODO/v1-release: remove this in favor of synchronously checking whether URL matches the route of a page (possible since Async Route Functions are now deprecated)
function isVikeLink(linkTag: HTMLElement) {
  const disableAutomaticLinkInterception = isDisableAutomaticLinkInterception()
  if (!disableAutomaticLinkInterception) {
    return true
  } else {
    const target = linkTag.getAttribute('data-vike-link')
    return target !== null && target !== 'false'
  }
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
