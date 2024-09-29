export { skipLink }

import { getBaseServer } from './getBaseServer.js'
import { assert, parseUrl, isBaseServer, isUrl, isUrlExternal } from './utils.js'

function skipLink(linkTag: HTMLElement): boolean {
  const url = linkTag.getAttribute('href')
  return (
    url === null ||
    !isUrl(url) ||
    url === '' ||
    isUrlExternal(url) ||
    isHashUrl(url) ||
    isNewTabLink(linkTag) ||
    !hasBaseServer(url) ||
    // Purposely last because disableAutomaticLinkInterception will be removed in the next major release
    !isVikeLink(linkTag)
  )
}

// TODO/next-major-release: remove this in favor of synchronously checking whether URL matches the route of a page (possible since Async Route Functions will be deprecated)
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
  if (url.includes('#') && removeHash(url) === removeHash(window.location.pathname)) {
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

function isDisableAutomaticLinkInterception(): boolean {
  // @ts-ignore
  return !!window._disableAutomaticLinkInterception
  /* globalObject should be used if we want to make disableAutomaticLinkInterception a page-by-page setting
  return globalObject.disableAutomaticLinkInterception ?? false
  */
}
