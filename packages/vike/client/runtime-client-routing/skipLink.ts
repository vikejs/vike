// TODO: rename_full skipLink isLinkSkipped
export { skipLink }
export { isLinkIgnored }
export { isSameAsCurrentUrl }

import { normalizeClientSideUrl } from '../shared/normalizeClientSideUrl.js'
import { getBaseServer } from './getBaseServer.js'
import { assert, parseUrl, isBaseServer, isUrl, isUrlExternal } from './utils.js'

function skipLink(linkTag: HTMLElement): boolean {
  const href = linkTag.getAttribute('href')
  return (
    href === null ||
    !isUrl(href) ||
    href === '' ||
    isUrlExternal(href) ||
    isSamePageHashLink(href) ||
    isNewTabLink(linkTag) ||
    isLinkIgnored(linkTag) ||
    !hasBaseServer(href) ||
    // Purposely last because disableAutomaticLinkInterception will be removed in the next major release
    !isVikeLink(linkTag)
  )
}

// TO-DO/next-major-release: remove this in favor of synchronously checking whether URL matches the route of a page (possible since Async Route Functions will be deprecated)
function isVikeLink(linkTag: HTMLElement) {
  const disableAutomaticLinkInterception = isDisableAutomaticLinkInterception()
  if (!disableAutomaticLinkInterception) {
    return true
  } else {
    // TODO: rename target attrVal
    const target = linkTag.getAttribute('data-vike-link')
    return target !== null && target !== 'false'
  }
}

// TODO rename
function isNewTabLink(linkTag: HTMLElement) {
  const target = linkTag.getAttribute('target')
  const rel = linkTag.getAttribute('rel')
  return target === '_blank' || target === '_external' || rel === 'external' || linkTag.hasAttribute('download')
}
function isLinkIgnored(linkTag: HTMLElement) {
  return linkTag.getAttribute('data-vike') === 'false'
}
// TODO refactor both functions below?
function isSamePageHashLink(href: string): boolean {
  if (href.startsWith('#')) return true
  // TODO: remove?
  if (
    href.includes('#') &&
    normalizeClientSideUrl(href, { withoutHash: true }) ===
      normalizeClientSideUrl(window.location.href, { withoutHash: true })
  ) {
    return true
  }
  return false
}
function isSameAsCurrentUrl(href: string) {
  if (href.startsWith('#')) return href === window.location.hash
  return normalizeClientSideUrl(href) === normalizeClientSideUrl(window.location.href)
}
function hasBaseServer(href: string): boolean {
  const baseServer = getBaseServer()
  assert(isBaseServer(baseServer))
  const { isBaseMissing } = parseUrl(href, baseServer)
  return !isBaseMissing
}

function isDisableAutomaticLinkInterception(): boolean {
  // @ts-ignore
  return !!window._disableAutomaticLinkInterception
  /* globalObject should be used if we want to make disableAutomaticLinkInterception a page-by-page setting
  return globalObject.disableAutomaticLinkInterception ?? false
  */
}
