export { redirect }
export { render }
export { RenderErrorPage }
export { isAbortError }
export { isAbortPageContext }
export { logAbortErrorHandled }
export { getPageContextFromAllRewrites }
export { AbortRender }
export { assertNoInfiniteAbortLoop }
export type { StatusCodeAbort }
export type { StatusCodeError }
export type { ErrorAbort }
export type { PageContextFromRewrite }
export type { UrlRedirect }

import {
  assert,
  assertInfo,
  assertUsage,
  assertWarning,
  checkType,
  hasProp,
  isBrowser,
  joinEnglish,
  objectAssign,
  projectInfo,
  truncateString
} from './utils.js'
import pc from '@brillout/picocolors'

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
  const pageContextAbort = {}
  objectAssign(pageContextAbort, {
    _abortCaller: abortCaller,
    _abortCall: `throw redirect(${statusCode})` as const,
    _urlRedirect: {
      url,
      statusCode
    }
  })
  return AbortRender(pageContextAbort)
}

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
function render(statusCode: 401 | 403 | 404 | 429 | 500 | 503, abortReason?: unknown): Error
/**
 * Abort the rendering of the current page, and render another page instead.
 *
 * https://vite-plugin-ssr.com/render
 *
 * @param url The URL to render.
 * @param abortReason Sets `pageContext.abortReason` which is used by the error page to show a message to the user, see https://vite-plugin-ssr.com/error-page
 */
function render(url: `/${string}`, abortReason?: unknown): Error
function render(value: string | number, abortReason?: unknown): Error {
  return render_(value, abortReason)
}

function render_(
  value: string | number,
  abortReason: unknown | undefined,
  pageContextAddendum?: { _isLegacyRenderErrorPage: true } & Record<string, unknown>
): Error {
  const pageContextAbort = { abortReason }
  if (pageContextAddendum) {
    assert(pageContextAddendum._isLegacyRenderErrorPage === true)
    objectAssign(pageContextAbort, pageContextAddendum)
  }
  {
    const args = [typeof value === 'number' ? String(value) : JSON.stringify(value)]
    if (abortReason !== undefined) args.push(truncateString(JSON.stringify(abortReason), 30, null))
    objectAssign(pageContextAbort, {
      _abortCaller: 'render' as const,
      _abortCall: `throw render(${args.join(', ')})` as const
    })
  }
  if (typeof value === 'string') {
    const url = value
    objectAssign(pageContextAbort, {
      _urlRewrite: url
    })
    return AbortRender(pageContextAbort)
  } else {
    const statusCode = value
    assertStatusCode(value, [401, 403, 404, 429, 500, 503], 'render')
    objectAssign(pageContextAbort, {
      _abortStatusCode: statusCode,
      is404: statusCode === 404
    })
    return AbortRender(pageContextAbort)
  }
}

type AbortCall = `throw redirect(${string})` | `throw render(${string})`
type PageContextAbort = {
  _abortCall: AbortCall
} & (
  | ({
      _abortCaller: 'redirect'
      _urlRedirect: UrlRedirect
    } & Omit<AbortUndefined, '_urlRedirect'>)
  | ({
      _abortCaller: 'render'
      abortReason: undefined | unknown
      _urlRewrite: string
    } & Omit<AbortUndefined, '_urlRewrite'>)
  | ({
      _abortCaller: 'render'
      abortReason: undefined | unknown
      _abortStatusCode: number
    } & Omit<AbortUndefined, '_abortStatusCode'>)
)
type AbortUndefined = {
  _urlRedirect?: undefined
  _urlRewrite?: undefined
  _abortStatusCode?: undefined
}

function AbortRender(pageContextAbort: PageContextAbort): Error {
  const err = new Error('AbortRender')
  objectAssign(err, { _pageContextAbort: pageContextAbort, [stamp]: true })
  checkType<ErrorAbort>(err)
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
type ErrorAbort = { _pageContextAbort: PageContextAbort }
function isAbortError(thing: unknown): thing is ErrorAbort {
  return typeof thing === 'object' && thing !== null && stamp in thing
}
function isAbortPageContext(pageContext: Record<string, unknown>): pageContext is PageContextAbort {
  if (!(pageContext._urlRewrite || pageContext._urlRedirect || pageContext._abortStatusCode)) {
    return false
  }
  assert(hasProp(pageContext, '_abortCall', 'string'))
  assert(hasProp(pageContext, '_abortCaller', 'string'))
  checkType<Omit<PageContextAbort, '_abortCall' | '_abortCaller'> & { _abortCall: string; _abortCaller: string }>(
    pageContext
  )
  return true
}

function logAbortErrorHandled(
  err: ErrorAbort,
  isProduction: boolean,
  pageContext: { urlOriginal: string; _urlRewrite: null | string }
) {
  if (isProduction) return
  const urlCurrent = pageContext._urlRewrite ?? pageContext.urlOriginal
  assert(urlCurrent)
  const abortCall = err._pageContextAbort._abortCall
  assertInfo(false, `${highlight(abortCall)} intercepted while rendering ${pc.bold(urlCurrent)}`, { onlyOnce: false })
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

function highlight(abortCall: AbortCall) {
  return isBrowser() ? '`' + abortCall + '`' : pc.cyan(abortCall)
}

function assertNoInfiniteAbortLoop(rewriteCount: number, redirectCount: number) {
  const abortCalls = [
    // prettier-ignore
    rewriteCount > 0 && highlight("throw render('/some-url')"),
    redirectCount > 0 && highlight("throw redirect('/some-url')")
  ]
    .filter(Boolean)
    .join(' and ')
  assertUsage(
    rewriteCount + redirectCount <= 7,
    `Maximum chain length of 7 ${abortCalls} exceeded. Did you define an infinite loop of ${abortCalls}?`
  )
}
