export { normalizeUrlArgument }

import { assertUsage, isUrl, isUrlRelative } from './utils.js'

function normalizeUrlArgument(url: string, fnName: 'prefetch' | 'navigate'): string {
  // Succinct error message to save client-side KBs
  const errMsg = `URL ${url} passed to ${fnName}() is invalid`
  assertUsage(isUrl(url), errMsg)
  if (url.startsWith(location.origin)) {
    // Use normalizeClientSideUrl() instead?
    url = url.slice(location.origin.length)
  }
  assertUsage(
    url.startsWith('/') || isUrlRelative(url),
    // `errMsg` used the original `url` value
    errMsg,
  )
  return url
}
