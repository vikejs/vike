export { redirect }
export { render }
export { RenderErrorPage }
export { isAbortError }
export { isAbortPageContext }
export { logAbort }
export { getPageContextAddendumAbort }
export { addNewPageContextAborted }
export { AbortRender }
export type { RedirectStatusCode }
export type { AbortStatusCode }
export type { ErrorAbort }
export type { PageContextAborted }
export type { UrlRedirect }
export type { PageContextAbort }

import { isUserHookError } from '../hooks/execHook.js'
import {
  assert,
  assertInfo,
  assertUsage,
  assertUsageUrlPathAbsolute,
  assertUsageUrlRedirectTarget,
  assertWarning,
  checkType,
  hasProp,
  isBrowser,
  joinEnglish,
  objectAssign,
  truncateString,
  unique,
} from './utils.js'
import pc from '@brillout/picocolors'

// For improved IntelliSense, we define the list of status code directly on redirect()'s argument type
type RedirectStatusCode = number & Parameters<typeof redirect>[1]
// For improved IntelliSense, we duplicate this list
type AbortStatusCode = number & Parameters<InferTwoOverloads<typeof render>[0]>[0]

type UrlRedirect = {
  url: string
  statusCode: RedirectStatusCode
}
type AbortRedirect = Error

type AbortReason = Required<({ abortReason?: unknown } & Vike.PageContext)['abortReason']>

/**
 * Abort the rendering of the current page, and redirect the user to another URL instead.
 *
 * https://vike.dev/redirect
 *
 * @param url The URL to redirect to.
 * @param statusCode By default the temporary redirection status code (`302`) is sent. For permanent redirections (`301`), use `+redirects` (https://vike.dev/redirects) or set this `statusCode` argument to `301`.
 */
function redirect(url: string, statusCode?: 301 | 302): AbortRedirect {
  const abortCaller = 'throw redirect()' as const
  assertUsageUrlRedirectTarget(url, getErrPrefix(abortCaller))
  const args = [JSON.stringify(url)]
  if (!statusCode) {
    statusCode = 302
  } else {
    if (
      // Tree-shaking to save client-side KBs
      !globalThis.__VIKE__IS_CLIENT ||
      globalThis.__VIKE__IS_DEV ||
      globalThis.__VIKE__IS_DEBUG
    ) {
      assertStatusCode(statusCode, [301, 302], 'redirect')
    }
    args.push(String(statusCode))
  }
  const pageContextAbort = {}
  objectAssign(pageContextAbort, {
    _abortCaller: abortCaller,
    _abortCall: `redirect(${args.join(', ')})` as const,
    _urlRedirect: {
      url,
      statusCode,
    },
  })
  return AbortRender(pageContextAbort)
}

/**
 * Abort the rendering of the current page, and render the error page instead.
 *
 * https://vike.dev/render
 *
 *
 * **Recommended** status codes:
 *   `401` — Unauthorized (user isn't logged in)
 *   `403` — Forbidden (user is logged in but isn't allowed)
 *   `404` — Not Found
 *   `410` — Gone (use this instead of `404` if the page existed in the past, see https://github.com/vikejs/vike/issues/1097#issuecomment-1695260887)
 *   `429` — Too Many Requests (rate limiting)
 *   `500` — Internal Server Error (your client or server has a bug)
 *   `503` — Service Unavailable (server is overloaded, or a third-party API isn't responding)
 *
 * **Not recommended** status codes:
 *   `400` — See https://github.com/vikejs/vike/issues/1008#issuecomment-3270894445
 *   Other status codes — See https://github.com/vikejs/vike/issues/1008
 *
 * @param abortStatusCode - One of the recommended status codes listed above.
 *
 * @param abortReason - Sets `pageContext.abortReason` which is usually used by the error page to show a message to the user, see https://vike.dev/error-page
 */
function render(abortStatusCode: 401 | 403 | 404 | 410 | 429 | 500 | 503, abortReason?: AbortReason): Error
/**
 * Abort the rendering of the current page, and render another page instead.
 *
 * https://vike.dev/render
 *
 * @param url The URL to render.
 * @param abortReason Sets `pageContext.abortReason` which is used by the error page to show a message to the user, see https://vike.dev/error-page
 */
function render(url: `/${string}`, abortReason?: AbortReason): Error
function render(urlOrStatusCode: string | AbortStatusCode, abortReason?: unknown): Error {
  const args = [typeof urlOrStatusCode === 'number' ? String(urlOrStatusCode) : JSON.stringify(urlOrStatusCode)]
  if (abortReason !== undefined) args.push(truncateString(JSON.stringify(abortReason), 30))
  const abortCaller = 'throw render()'
  const abortCall = `render(${args.join(', ')})` as const
  return render_(urlOrStatusCode, abortReason, abortCall, abortCaller)
}

function render_(
  urlOrStatusCode: string | AbortStatusCode,
  abortReason: unknown | undefined,
  abortCall: `render(${string})` | `RenderErrorPage()`,
  abortCaller: 'throw render()' | 'throw RenderErrorPage()',
  pageContextAddendum?: { _isLegacyRenderErrorPage: true } & Record<string, unknown>,
): Error {
  const pageContextAbort = {
    abortReason,
    _abortCaller: abortCaller,
    _abortCall: abortCall,
  }
  if (pageContextAddendum) {
    assert(pageContextAddendum._isLegacyRenderErrorPage === true)
    objectAssign(pageContextAbort, pageContextAddendum)
  }
  if (typeof urlOrStatusCode === 'string') {
    const url = urlOrStatusCode
    assertUsageUrlPathAbsolute(url, getErrPrefix(abortCaller))
    objectAssign(pageContextAbort, {
      _urlRewrite: url,
    })
    return AbortRender(pageContextAbort)
  } else {
    if (
      // Tree-shaking to save client-side KBs
      !globalThis.__VIKE__IS_CLIENT ||
      globalThis.__VIKE__IS_DEV ||
      globalThis.__VIKE__IS_DEBUG
    ) {
      assertStatusCode(urlOrStatusCode, [401, 403, 404, 410, 429, 500, 503], 'render')
    }
    const abortStatusCode = urlOrStatusCode
    objectAssign(pageContextAbort, {
      abortStatusCode,
      is404: abortStatusCode === 404,
    })
    return AbortRender(pageContextAbort)
  }
}

type AbortCall = `redirect(${string})` | `render(${string})` | `RenderErrorPage()`
type AbortCaller = `throw redirect()` | `throw render()` | `throw RenderErrorPage()`
type PageContextAbort = {
  _abortCall: AbortCall
  _abortCaller: AbortCaller
} & (
  | ({
      _abortCall: `redirect(${string})`
      _abortCaller: 'throw redirect()'
      _urlRedirect: UrlRedirect
    } & Omit<AbortUndefined, '_urlRedirect'>)
  | ({
      _abortCall: `render(${string})` | `RenderErrorPage()`
      _abortCaller: 'throw render()' | 'throw RenderErrorPage()'
      abortReason: undefined | unknown
      _urlRewrite: string
    } & Omit<AbortUndefined, '_urlRewrite'>)
  | ({
      _abortCall: `render(${string})` | `RenderErrorPage()`
      _abortCaller: 'throw render()' | 'throw RenderErrorPage()'
      abortReason: undefined | unknown
      abortStatusCode: AbortStatusCode
    } & Omit<AbortUndefined, 'abortStatusCode'>)
)
type AbortUndefined = {
  _urlRedirect?: undefined
  _urlRewrite?: undefined
  abortStatusCode?: undefined
}

function AbortRender(pageContextAbort: PageContextAbort): Error {
  const err = new Error('AbortRender')
  objectAssign(err, { _pageContextAbort: pageContextAbort, [stamp]: true })
  checkType<ErrorAbort>(err)
  return err
}

// TO-DO/next-major-release: remove
/**
 * @deprecated Use `throw render()` or `throw redirect()` instead, see https://vike.dev/render'
 */
function RenderErrorPage({ pageContext = {} }: { pageContext?: Record<string, unknown> } = {}): Error {
  assertWarning(
    false,
    `${pc.cyan('throw RenderErrorPage()')} is deprecated and will be removed in the next major release. Use ${pc.cyan(
      'throw render()',
    )} or ${pc.cyan('throw redirect()')} instead, see https://vike.dev/render`,
    { onlyOnce: false },
  )
  let abortStatusCode: 404 | 500 = 404
  let abortReason = 'Page Not Found'
  if (pageContext.is404 === false || (pageContext.pageProps as any)?.is404 === false) {
    abortStatusCode = 500
    abortReason = 'Something went wrong'
  }
  objectAssign(pageContext, { _isLegacyRenderErrorPage: true as const })
  return render_(abortStatusCode, abortReason, 'RenderErrorPage()', 'throw RenderErrorPage()', pageContext)
}

const stamp = '_isAbortError'
type ErrorAbort = { _pageContextAbort: PageContextAbort }
function isAbortError(thing: unknown): thing is ErrorAbort {
  return typeof thing === 'object' && thing !== null && stamp in thing
}
function isAbortPageContext(pageContext: Record<string, unknown>): pageContext is PageContextAbort {
  if (!(pageContext._urlRewrite || pageContext._urlRedirect || pageContext.abortStatusCode)) {
    return false
  }
  assert(hasProp(pageContext, '_abortCall', 'string'))
  /* Isn't needed and is missing on the client-side
  assert(hasProp(pageContext, '_abortCaller', 'string'))
  */
  checkType<Omit<PageContextAbort, '_abortCall' | '_abortCaller'> & { _abortCall: string }>(pageContext)
  return true
}

function logAbort(
  err: ErrorAbort,
  isProduction: boolean,
  pageContext: { urlOriginal: string; _urlRewrite?: string },
) {
  if (isProduction) return
  const urlCurrent = pageContext._urlRewrite ?? pageContext.urlOriginal
  assert(urlCurrent)
  const abortCall = err._pageContextAbort._abortCall
  assert(abortCall)

  const hookLoc = isUserHookError(err)
  let thrownBy = ''
  if (hookLoc) {
    thrownBy = ` by ${pc.cyan(`${hookLoc.hookName}()`)} hook defined at ${hookLoc.hookFilePath}`
  } else {
    // hookLoc is missing when serializing abort errors from server to client
  }

  assertInfo(false, `${pc.cyan(abortCall)} thrown${thrownBy} while rendering ${pc.cyan(urlCurrent)}`, {
    onlyOnce: false,
  })
}

function assertStatusCode(statusCode: number, expected: number[], caller: 'render' | 'redirect') {
  assert(!globalThis.__VIKE__IS_CLIENT || globalThis.__VIKE__IS_DEV || globalThis.__VIKE__IS_DEBUG) // assert tree-shaking

  // double check vike:pluginReplaceConstantsGlobalThis
  if (globalThis.__VIKE__IS_CLIENT) {
    assert(isBrowser())
    assert(typeof globalThis.__VIKE__IS_DEV === 'boolean')
    assert(typeof globalThis.__VIKE__IS_CLIENT === 'boolean')
    assert(import.meta.env.SSR === false)
    assert(import.meta.env.DEV === globalThis.__VIKE__IS_DEV)
  } else {
    assert(!isBrowser())
    if (import.meta.env) {
      assert(typeof globalThis.__VIKE__IS_DEV === 'boolean')
      assert(typeof globalThis.__VIKE__IS_CLIENT === 'boolean')
      assert(import.meta.env.SSR === true)
      assert(import.meta.env.DEV === globalThis.__VIKE__IS_DEV)
    } else {
      // import.meta.env isn't defined when 'vike' is ssr.external
    }
  }

  const expectedEnglish = joinEnglish(
    expected.map((s) => pc.bold(String(s))),
    'or',
  )
  const statusCodeWithColor = pc.bold(String(statusCode))
  if (statusCode === 400) {
    assert(!expected.includes(statusCode))
    assertWarning(
      false,
      `We recommend against using the status code ${statusCodeWithColor} passed to ${caller}() — we recommend using ${pc.bold('404')} instead, see https://github.com/vikejs/vike/issues/1008#issuecomment-3270894445`,
      { onlyOnce: true, showStackTrace: true },
    )
  } else {
    assertWarning(
      expected.includes(statusCode),
      `Unexpected status code ${statusCodeWithColor} passed to ${caller}() — we recommend using ${expectedEnglish} instead. (Or reach out at https://github.com/vikejs/vike/issues/1008 if you believe ${statusCodeWithColor} should be added.)`,
      { onlyOnce: true, showStackTrace: true },
    )
  }
}

type PageContextMin = { urlOriginal: string }
type PageContextAborted = { _pageContextAbort: PageContextAbort } & PageContextMin
function getPageContextAddendumAbort(pageContextsAborted: PageContextAborted[]) {
  const pageContextAbortedLast = pageContextsAborted.at(-1)
  if (!pageContextAbortedLast) return null
  const pageContextAbort = pageContextAbortedLast._pageContextAbort
  assert(pageContextAbort)
  // Sets pageContext._urlRewrite from pageContextAbort._urlRewrite
  return pageContextAbort
}
function addNewPageContextAborted(
  pageContextsAborted: PageContextAborted[],
  pageContext: PageContextMin,
  pageContextAbort: PageContextAbort,
) {
  objectAssign(pageContext, { _pageContextAbort: pageContextAbort })
  pageContextsAborted.push(pageContext)
  assertNoInfiniteAbortLoop(pageContextsAborted)
}
// There doesn't seem to be a way to count the number of HTTP redirects (Vike doesn't have access to the HTTP request headers/cookies)
// https://stackoverflow.com/questions/9683007/detect-infinite-http-redirect-loop-on-server-side
function assertNoInfiniteAbortLoop(pageContextsAborted: PageContextAborted[]) {
  if (pageContextsAborted.length < 10) return
  const loop = pageContextsAborted.map((pageContext) => {
    return pageContext._pageContextAbort._abortCall
  })
  // Unique array => no redundant call => no infinite loop
  if (unique(loop).length === loop.length) return
  assertUsage(false, `Infinite loop: ${loop.join(' => ')}`)
}

function getErrPrefix(abortCaller: AbortCaller) {
  return `URL passed to ${pc.code(abortCaller)}` as const
}

// https://github.com/microsoft/TypeScript/issues/28867#issue-387798238
// https://stackoverflow.com/questions/58773217/how-to-use-parameters-type-on-overloaded-functions#comment103832704_58773217
type InferTwoOverloads<F extends Function> = F extends { (...a1: infer A1): infer R1; (...a0: infer A0): infer R0 }
  ? [(...a1: A1) => R1, (...a0: A0) => R0]
  : never
