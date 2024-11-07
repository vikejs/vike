export { normalizeUrlArgument }

import { assertUsage, isUrl, isUrlPathnameRelative } from './utils'

function normalizeUrlArgument(url: string, fnName: 'prefetch' | 'navigate'): string {
  // Succinct error message to save client-side KBs
  const errMsg = `[${fnName}(url)] Invalid URL ${url}`
  assertUsage(isUrl(url), errMsg)
  if (url.startsWith(location.origin)) {
    url = url.slice(location.origin.length)
  }
  assertUsage(
    url.startsWith('/') || isUrlPathnameRelative(url),
    // `errMsg` used the original `url` value
    errMsg
  )
  return url
}
