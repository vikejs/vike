import { addUrlOrigin, assert, assertUsage, handleUrlOrigin, slice } from '../shared/utils'

import { getSsrEnv } from './ssrEnv'

export { analyzeBaseUrl }
export { prependBaseUrl }
export { assertBaseUrl }

// Possible Base URL values:
// `base: '/some-nested-path/'`
// `base: 'http://another-origin.example.org/'`
// `base: './'` (WIP: not supported yet)
function assertBaseUrl(baseUrl: string, userErrorMessagePrefix?: string) {
  if (!userErrorMessagePrefix) {
    assert(baseUrl.startsWith('/') || baseUrl.startsWith('http'))
    return
  }
  assertUsage(
    baseUrl.startsWith('/') || baseUrl.startsWith('http') || baseUrl.startsWith('./'),
    userErrorMessagePrefix + 'Wrong `base` value `' + baseUrl + '`; `base` should start with `/`, `./`, or `http`.'
  )
  assertUsage(
    !baseUrl.startsWith('./'),
    'Relative Base URLs are not supported yet (`baseUrl` that starts with `./`). Open a new GitHub ticket so we can discuss adding support for your use case.'
  )
}

function analyzeBaseUrl(url_: string) {
  // Unmutable
  const urlPristine = url_
  // Mutable
  let url = url_

  assert(url.startsWith('/') || url.startsWith('http'))
  const baseUrl = getBaseUrl()
  assert(baseUrl.startsWith('/') || baseUrl.startsWith('http'))

  if (baseUrl === '/') {
    return { urlWithoutBaseUrl: urlPristine, hasBaseUrl: true }
  }

  const { urlWithoutOrigin, urlOrigin } = handleUrlOrigin(url)
  let urlOriginHasBeenRemoved = false
  {
    const baseUrlOrigin = handleUrlOrigin(baseUrl).urlOrigin
    const baseUrlHasOrigin = baseUrlOrigin !== null
    let urlHasOrigin = urlOrigin !== null
    assertUsage(
      !baseUrlHasOrigin || urlHasOrigin,
      `You provided a \`baseUrl\` (\`${baseUrl}\`) that contains a URL origin (\`${baseUrlOrigin!}\`) but the \`pageContext.url\` (\`${url}\`) you provided in your server middleware (\`const renderPage = createPageRenderer(/*...*/); renderPage(pageContext);\`) does not contain a URL origin. Either remove the URL origin from your \`baseUrl\` or make sure to always provide the URL origin in \`pageContext.url\`.`
    )
    if (urlHasOrigin && !baseUrlHasOrigin) {
      urlOriginHasBeenRemoved = true
      url = urlWithoutOrigin
      urlHasOrigin = false
    }
    assert(urlHasOrigin === baseUrlHasOrigin)
  }

  if (!url.startsWith(baseUrl)) {
    return { urlWithoutBaseUrl: urlPristine, hasBaseUrl: false }
  }
  assert(url.startsWith('/') || url.startsWith('http'))
  url = url.slice(baseUrl.length)
  /* url can actually start with `httpsome-pathname`
  assert(!url.startsWith('http'))
  */
  /* `handleUrlOrigin('some-pathname-without-leading-slash')` fails
  assert((handleUrlOrigin(url).urlOrigin===null))
  */
  if (!url.startsWith('/')) url = '/' + url
  assert(url.startsWith('/'))

  if (urlOriginHasBeenRemoved) {
    assert(urlOrigin !== null)
    assert(urlOrigin.startsWith('http'))
    assert(url.startsWith('/'))
    url = addUrlOrigin(url, urlOrigin)
    assert(url.startsWith('http'))
  }

  return { urlWithoutBaseUrl: url, hasBaseUrl: true }
}

function prependBaseUrl(url: string): string {
  let baseUrl = getBaseUrl()

  // Probably safer to remove the origin; `prependBaseUrl()` is used when injecting static assets in HTML;
  // origin is useless in static asset URLs, while the origin causes trouble upon `https`/`http` mismatch.
  baseUrl = handleUrlOrigin(baseUrl).urlWithoutOrigin

  if (baseUrl === '/') return url

  if (baseUrl.endsWith('/')) {
    baseUrl = slice(baseUrl, 0, -1)
  }

  // We can and should expect `baseUrl` to not contain `/` doublets. (We cannot expect url to not contain `/` doublets.)
  assert(!baseUrl.endsWith('/'))
  assert(url.startsWith('/'))
  return `${baseUrl}${url}`
}

function getBaseUrl(): string {
  const { baseUrl } = getSsrEnv()
  assertBaseUrl(baseUrl)
  return baseUrl
}
