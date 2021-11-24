import { analyzeBaseUrl, assertBaseUrl, assertWarning, isRelativeUrl } from '../../../shared/utils'
import { isExternalLink } from './isExternalLink'

export { skipLink }

function skipLink(linkTag: HTMLElement): boolean {
  const url = linkTag.getAttribute('href')

  if (!url) return true
  if (isExternalLink(url)) return true
  if (isNewTabLink(linkTag)) return true
  if (isHashUrl(url)) return true
  if (isRelativeUrl(url)) {
    assertWarning(
      false,
      `[Client Router] Skipping \`<a href="${url}">\` link because \`${url}\` is a relative URL. If you need support for relative URLs, create a new GitHub ticket.`,
    )
    return true
  }
  if (!hasBaseUrl(url)) {
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
  const baseUrl = import.meta.env.BASE_URL
  assertBaseUrl(baseUrl)
  const { hasBaseUrl } = analyzeBaseUrl(url, baseUrl)
  return hasBaseUrl
}
