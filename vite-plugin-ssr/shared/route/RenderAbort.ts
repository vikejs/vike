export { redirect }
export { renderUrl }
export { renderErrorPage }
export { isAbortError }
export { logAbortErrorHandled }
export { RenderErrorPage }
export { getPageContextFromAllRewrites }
export type { StatusCodeAbort }
export type { AbortError }
export type { PageContextFromRewrite }

import { assertPageContextProvidedByUser } from '../assertPageContextProvidedByUser'
import {
  assert,
  assertInfo,
  assertUsage,
  assertWarning,
  checkType,
  joinEnglish,
  objectAssign,
  projectInfo
} from './utils'

type StatusCodeAbort = StatusCodeRedirect | StatusCodeError
type StatusCodeRedirect = 301 | 302
type StatusCodeError = 401 | 403 | 404 | 429 | 500 | 503

/**
 * Abort the current page rendering, and redirect the user to another URL.
 *
 * https://vite-plugin-ssr.com/abort
 *
 * @param statusCode `301` (permanent) or `302` (temporary) redirection.
 * @param url The URL to redirect to.
 * @param pageContextAddition [Optional] Add pageContext values.
 */
function redirect(statusCode: StatusCodeRedirect, url: string, pageContextAddition?: Record<string, unknown>): Error {
  const abortCaller = 'redirect' as const
  assertPageContextProvidedByUser(pageContextAddition, { abortCaller })
  assertStatusCode(statusCode, [301, 302], 'redirect')
  pageContextAddition = pageContextAddition ?? {}
  objectAssign(pageContextAddition, {
    _statusCode: statusCode,
    _abortCaller: abortCaller,
    _abortCall: `throw redirect(${statusCode})` as const,
    _urlRedirect: url
  })
  return RenderAbort(pageContextAddition)
}

/**
 * Abort the current page rendering, and render another page instead (while preserivng the current URL, unlike redirect() which changes the URL).
 *
 * https://vite-plugin-ssr.com/abort
 *
 * @param url The URL to render.
 * @param pageContextAddition [Optional] Add pageContext values.
 */
function renderUrl(url: string, pageContextAddition?: Record<string, unknown>): Error {
  const abortCaller = 'renderUrl' as const
  assertPageContextProvidedByUser(pageContextAddition, { abortCaller })
  pageContextAddition = pageContextAddition ?? {}
  objectAssign(pageContextAddition, {
    _abortCaller: abortCaller,
    _abortCall: `throw renderUrl('${url}')` as const,
    _urlRewrite: url
  })
  return RenderAbort(pageContextAddition)
}

/**
 * Abort the current page rendering, and render the error page instead (for example a 401 or 404 page).
 *
 * https://vite-plugin-ssr.com/abort
 *
 * @param statusCode
 * One of the following:
 *   `401` Unauthorized (user isn't logged in)
 *   `403` Forbidden (user is logged in but isn't allowed)
 *   `404` Not Found
 *   `429` Too Many Requests (rate limiting)
 *   `500` Internal Server Error (app has a bug)
 *   `503` Service Unavailable (server is overloaded, a third-party API isn't responding)
 * @param errorReason The reason why the original page was aborted. Usually used for showing a custom message on the error page.
 * @param pageContextAddition [Optional] Add pageContext values.
 */
function renderErrorPage(
  statusCode: StatusCodeError,
  errorReason?: string | JSX.Element | null,
  pageContextAddition?: Record<string, unknown>
): Error {
  const abortCaller = 'renderErrorPage' as const
  assertPageContextProvidedByUser(pageContextAddition, { abortCaller })
  assertStatusCode(statusCode, [401, 403, 404, 429, 500, 503], abortCaller)
  pageContextAddition = pageContextAddition ?? {}
  objectAssign(pageContextAddition, {
    _statusCode: statusCode,
    errorReason,
    is404: statusCode === 404,
    _abortCaller: abortCaller,
    _abortCall: `throw renderErrorPage(${statusCode}, '${errorReason}')` as const
  })
  return RenderAbort(pageContextAddition)
}

type PageContextRenderAbort = Record<string, unknown> & {
  _abortCall: `throw redirect(${string})` | `throw renderUrl(${string})` | `throw renderErrorPage(${string})`
} & (
    | {
        _abortCaller: 'redirect'
        _urlRedirect: string
      }
    | {
        _abortCaller: 'renderUrl'
        _urlRewrite: string
      }
    | {
        _abortCaller: 'renderErrorPage'
      }
  )
function RenderAbort(pageContextAddition: PageContextRenderAbort): Error {
  const err = new Error('RenderAbort')
  objectAssign(err, { _pageContextAddition: pageContextAddition, [stamp]: true })
  checkType<AbortError>(err)
  return err
}

/**
 * @deprecated Use `throw renderErrorPage()`, `throw renderUrl()` or `throw redirect()` instead.
 *
 *  See https://vite-plugin-ssr.com/abort'
 */
function RenderErrorPage({ pageContext }: { pageContext?: Record<string, unknown> } = {}): Error {
  assertWarning(
    false,
    '`throw RenderErrorPage()` is deprecated and will be removed in the next major release. Use `throw renderErrorPage()`, `throw renderUrl()` or `throw redirect()` instead, see https://vite-plugin-ssr.com/abort'
  )
  assertPageContextProvidedByUser(pageContext, { abortCaller: 'RenderErrorPage' })
  let statusCode: 404 | 500 = 404
  let errorReason = 'Page Not Found'
  if (pageContext.is404 === false || (pageContext.pageProps as any)?.is404 === false) {
    statusCode = 500
    errorReason = 'Something went wrong'
  }
  return renderErrorPage(statusCode, errorReason, pageContext)
}

const stamp = '_isAbortError'
type AbortError = { _pageContextAddition: Record<string, unknown> & PageContextRenderAbort }
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

function assertStatusCode(statusCode: number, expected: number[], caller: 'renderErrorPage' | 'redirect') {
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
        const loop: string = [...urlRewrites.slice(idx), urlRewrite].map((url) => `renderUrl('${url}')`).join(' => ')
        assertUsage(false, `Infinite loop of renderUrl() calls: ${loop}`)
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
