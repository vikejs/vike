export { redirect }
export { render }
export { RenderErrorPage }
export { isAbortError }
export { logAbortErrorHandled }
export { getPageContextFromAllRewrites }
export type { StatusCodeAbort }
export type { StatusCodeError }
export type { AbortError }
export type { PageContextFromRewrite }
export type { AbortReason }
export type { UrlRedirect }

import {
  assert,
  assertInfo,
  assertUsage,
  assertWarning,
  checkType,
  joinEnglish,
  objectAssign,
  projectInfo,
  truncateString
} from './utils'

type StatusCodeAbort = StatusCodeRedirect | StatusCodeError
type StatusCodeRedirect = 301 | 302
type StatusCodeError = number &
  // For improved IntelliSense, we define the list of status code directly on render()'s argument type
  Parameters<typeof render>[0]

type UrlRedirect = {
  url: string
  statusCode: StatusCodeRedirect
}
type AbortRedirect = Error
type AbortRender = Error

/**
 * Abort the rendering of the current page, and redirect the user to another URL instead.
 *
 * https://vite-plugin-ssr.com/redirect
 *
 * @param statusCode `301` (permanent) or `302` (temporary) redirection.
 * @param url The URL to redirect to.
 */
function redirect(url: `/${string}` | `https://${string}` | `http://${string}`): AbortRedirect
function redirect(
  url: `/${string}` | `https://${string}` | `http://${string}`,
  statusCode?: StatusCodeRedirect
): AbortRedirect {
  const abortCaller = 'redirect' as const
  statusCode ??= 302
  assertStatusCode(statusCode, [301, 302], 'redirect')
  assertWarning(
    statusCode !== 301,
    "Status code 301 for `throw redirect()' is experimental and may be removed at any point",
    { onlyOnce: true }
  )
  const pageContextAddition = {}
  objectAssign(pageContextAddition, {
    _abortCaller: abortCaller,
    _abortCall: `throw redirect(${statusCode})` as const,
    _urlRedirect: {
      url,
      statusCode
    }
  })
  return RenderAbort(pageContextAddition)
}

/**
 * Abort the rendering of the current page, and render another page instead.
 *
 * https://vite-plugin-ssr.com/render
 *
 * @param url The URL to render.
 * @param abortReason Sets `pageContext.abortReason` which is used by the error page to show a message to the user, see https://vite-plugin-ssr.com/error-page
 */
function render(url: `/${string}`, abortReason?: string): AbortRender
/**
 * Abort the rendering of the current page, and render the error page instead.
 *
 * https://vite-plugin-ssr.com/render
 *
 * @param statusCode
 * One of the following:
 *   `401` Unauthorized (user isn't logged in)
 *   `403` Forbidden (user is logged in but isn't allowed)
 *   `404` Not Found
 *   `429` Too Many Requests (rate limiting)
 *   `500` Internal Server Error (app has a bug)
 *   `503` Service Unavailable (server is overloaded, a third-party API isn't responding)
 * @param abortReason Sets `pageContext.abortReason` which is used by the error page to show a message to the user, see https://vite-plugin-ssr.com/error-page
 */
function render(statusCode: 401 | 403 | 404 | 429 | 500 | 503, abortReason?: string): AbortRender
function render(value: string | StatusCodeError, abortReason?: string): AbortRender {
  return render_(value, abortReason)
}

function render_(
  value: string | number,
  // The user cannot set pageContext beyond pageContext.abortReason because:
  //  - Upon client-side routing, the additional pageContext would need to be serialized and passed to the client-side.
  //    - For that, pageContext.passToClient is required but how do make sure pageContext.passToClient is set before `throw render()`?
  abortReason: string | undefined,
  pageContextAddendum?: { _isLegacyRenderErrorPage: true } & Record<string, unknown>
): AbortRender {
  const pageContextAddition = { abortReason }
  if (pageContextAddendum) {
    assert(pageContextAddendum._isLegacyRenderErrorPage === true)
    objectAssign(pageContextAddition, pageContextAddendum)
  }
  {
    const args = [typeof value === 'number' ? String(value) : JSON.stringify(value)]
    if (abortReason !== undefined) args.push(JSON.stringify(truncateString(abortReason, 30, null)))
    objectAssign(pageContextAddition, {
      _abortCaller: 'render' as const,
      _abortCall: `throw render(${args.join(', ')})` as const
    })
  }
  if (typeof value === 'string') {
    const url = value
    objectAssign(pageContextAddition, {
      _urlRewrite: url
    })
    return RenderAbort(pageContextAddition)
  } else {
    const statusCode = value
    assertStatusCode(value, [401, 403, 404, 429, 500, 503], 'render')
    objectAssign(pageContextAddition, {
      _abortStatusCode: statusCode,
      is404: statusCode === 404
    })
    return RenderAbort(pageContextAddition)
  }
}

type AbortReason = string | JSX.Element | null

type PageContextRenderAbort = {
  _abortCall: `throw redirect(${string})` | `throw render(${string})`
  abortReason?: string
} & (
  | {
      _abortCaller: 'redirect'
      _urlRedirect: UrlRedirect
    }
  | {
      _abortCaller: 'render'
      _urlRewrite: string
    }
  | {
      _abortCaller: 'render'
      _abortStatusCode: number
    }
)
function RenderAbort(pageContextAddition: PageContextRenderAbort): Error {
  const err = new Error('RenderAbort')
  objectAssign(err, { _pageContextAddition: pageContextAddition, [stamp]: true })
  checkType<AbortError>(err)
  return err
}

/**
 * @deprecated Use `throw render()` or `throw redirect()` instead, see https://vite-plugin-ssr.com/render'
 */
function RenderErrorPage({ pageContext = {} }: { pageContext?: Record<string, unknown> } = {}): Error {
  assertWarning(
    false,
    '`throw RenderErrorPage()` is deprecated and will be removed in the next major release. Use `throw render()` or `throw redirect()` instead, see https://vite-plugin-ssr.com/render',
    { onlyOnce: true }
  )
  let statusCode: 404 | 500 = 404
  let abortReason = 'Page Not Found'
  if (pageContext.is404 === false || (pageContext.pageProps as any)?.is404 === false) {
    statusCode = 500
    abortReason = 'Something went wrong'
  }
  objectAssign(pageContext, { _isLegacyRenderErrorPage: true as const })
  return render_(statusCode, abortReason, pageContext)
}

const stamp = '_isAbortError'
type AbortError = { _pageContextAddition: PageContextRenderAbort }
function isAbortError(thing: unknown): thing is AbortError {
  return typeof thing === 'object' && thing !== null && stamp in thing
}

function logAbortErrorHandled(
  err: AbortError,
  isProduction: boolean,
  pageContext: { urlOriginal: string; _urlRewrite: null | string }
) {
  if (isProduction) return
  const urlCurrent = pageContext._urlRewrite ?? pageContext.urlOriginal
  assert(urlCurrent)
  // TODO: add color for server-side
  const abortCall = err._pageContextAddition._abortCall
  assertInfo(false, `${abortCall} intercepted while rendering URL '${urlCurrent}'`, { onlyOnce: false })
}

function assertStatusCode(statusCode: number, expected: number[], caller: 'render' | 'redirect') {
  const expectedEnglish = joinEnglish(
    expected.map((s) => s.toString()),
    'or'
  )
  assertWarning(
    expected.includes(statusCode),
    `Unepexected status code ${statusCode} passed to ${caller}(), we recommend ${expectedEnglish} instead. (Or reach out at ${projectInfo.githubRepository}/issues/1008 if you believe ${statusCode} should be added.)`,
    { onlyOnce: true }
  )
}

type PageContextFromRewrite = { _urlRewrite: string } & Record<string, unknown>
type PageContextFromAllRewrites = { _urlRewrite: null | string } & Record<string, unknown>
function getPageContextFromAllRewrites(pageContextsFromRewrite: PageContextFromRewrite[]): PageContextFromAllRewrites {
  assertNoInfiniteLoop(pageContextsFromRewrite)
  const pageContextFromAllRewrites: PageContextFromAllRewrites = { _urlRewrite: null }
  pageContextsFromRewrite.forEach((pageContextFromRewrite) => {
    Object.assign(pageContextFromAllRewrites, pageContextFromRewrite)
  })
  return pageContextFromAllRewrites
}
function assertNoInfiniteLoop(pageContextsFromRewrite: PageContextFromRewrite[]) {
  const urlRewrites: string[] = []
  pageContextsFromRewrite.forEach((pageContext) => {
    const urlRewrite = pageContext._urlRewrite
    {
      const idx = urlRewrites.indexOf(urlRewrite)
      if (idx !== -1) {
        const loop: string = [...urlRewrites.slice(idx), urlRewrite].map((url) => `render('${url}')`).join(' => ')
        assertUsage(false, `Infinite loop of render() calls: ${loop}`)
      }
    }
    urlRewrites.push(urlRewrite)
  })
}

declare global {
  namespace JSX {
    // Overriden by the user's UI framework. (Technically, TypeScript doesn't do overriding but interface merging, but it has same effect here.)
    interface Element {}
  }
}
