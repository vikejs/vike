export { redirect }
export { renderUrl }
export { renderErrorPage }
export { isAbortError }
export { logAbortErrorHandled }
export { RenderErrorPage }
export type { StatusCodeAbort }

// TODO: catch infinte loop

import { assertPageContextProvidedByUser } from '../assertPageContextProvidedByUser'
import { assert, assertInfo, assertWarning, checkType, joinEnglish, objectAssign, projectInfo } from './utils'

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
    _redirect: url,
    _statusCode: statusCode,
    _abortCaller: abortCaller
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
    _renderUrl: url,
    _abortCaller: abortCaller
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
 *   `401` Unauthorized (no permission: user isn't logged in)
 *   `403` Forbidden (no permission: user is logged in but isn't allowed)
 *   `404` Not Found
 *   `429` Too Many Requests (rate limiting)
 *   `500` Internal Server Error (the app has a bug)
 *   `503` Service Unavailable (examples: server is overloaded or a third-party API isn't responding)
 * You can pass another status code e.g. `renderErrorPage(503 as any)` but we recommend against it because other status codes are irrelevant in the context of rendering a page (most status codes are about APIs).
 * @param errorReason Message shown to the user.
 * @param pageContextAddition [Optional] Add pageContext values.
 */
function renderErrorPage(
  statusCode: StatusCodeError,
  errorReason: string,
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
    _abortCaller: abortCaller
  })
  return RenderAbort(pageContextAddition)
}

type PageContextRenderAbort = Record<string, unknown> & {
  _abortCaller: 'renderErrorPage' | 'redirect' | 'renderUrl'
}
/* Is this needed?
  | {
      _redirect:  string
    }
  | {
      _renderUrl: string
    }
    */
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

function logAbortErrorHandled(err: AbortError, isProduction: boolean, pageContext: { urlOriginal: string }) {
  if (isProduction) return
  const abortCaller = err._pageContextAddition._abortCaller
  const { urlOriginal } = pageContext
  assert(urlOriginal)
  // TODO: Replace assertInfo() with proper logger implementation
  assertInfo(
    false,
    `throw ${abortCaller}() successfully handled while rendering URL '${urlOriginal}' (this log isn't shown in production)`,
    { onlyOnce: false }
  )
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
