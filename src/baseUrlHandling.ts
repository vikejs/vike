import { assert, assertUsage, slice } from './utils'

import { getSsrEnv } from './ssrEnv.node'

export { prependBaseUrl }
export { removeBaseUrl }
export { startsWithBaseUrl }
export { assertBaseUrl }

// Possible values:
// `base: '/some-nested-path/'`
// `base: 'https://another-origin.example.org/'`
// `base: './'`

function prependBaseUrl(url: string): string {
  let baseUrl = getNormalizedBaseUrl()
  if (baseUrl === '/') return url
  assert(baseUrl.endsWith('/'))
  baseUrl = slice(baseUrl, 0, -1)
  assert(!baseUrl.endsWith('/'))
  assert(url.startsWith('/'))
  return `${baseUrl}${url}`
}

function startsWithBaseUrl(url: string): boolean {
  const baseUrl = getNormalizedBaseUrl()
  if (baseUrl === '/') return true
  return url.startsWith(baseUrl)
}
function removeBaseUrl(url: string): string {
  const baseUrl = getNormalizedBaseUrl()
  if (baseUrl === '/') return url
  assert(startsWithBaseUrl(url))
  url = url.slice(baseUrl.length)
  if (!url.startsWith('/')) url = '/' + url
  return url
}

function getNormalizedBaseUrl(): string {
  let { baseUrl } = getSsrEnv()
  baseUrl = normalizeBaseUrl(baseUrl)
  return baseUrl
}

function normalizeBaseUrl(baseUrl: string): string {
  if (!baseUrl) baseUrl = '/'
  if (!baseUrl.endsWith('/')) baseUrl = `${baseUrl}/`
  if (!baseUrl.startsWith('/') && !baseUrl.startsWith('http') && !baseUrl.startsWith('./')) baseUrl = `/${baseUrl}`
  assert(baseUrl.startsWith('/') || baseUrl.startsWith('http') || baseUrl.startsWith('./'))
  assert(baseUrl.endsWith('/'))
  return baseUrl
}

function assertBaseUrl(baseUrl: string, errorMessagePrefix = '') {
  assertUsage(
    baseUrl.startsWith('/') || baseUrl.startsWith('http') || baseUrl.startsWith('./'),
    errorMessagePrefix + 'Wrong `base` value `' + baseUrl + '`; `base` should start with `/`, `./`, or `http`.'
  )
}
