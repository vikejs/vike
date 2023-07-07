export { redirect }
export { renderUrl }
export { renderErrorPage }
export { isRenderAbort }
export { RenderErrorPage }
export type { StatusCodeAbort }

import { assertPageContextProvidedByUser } from '../assertPageContextProvidedByUser'
import { assertWarning, checkType, joinEnglish, objectAssign, projectInfo } from './utils'

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
  assertPageContextProvidedByUser(pageContextAddition, { abort: 'redirect' })
  assertStatusCode(statusCode, [301, 302], 'redirect')
  const pageContextAddendum = pageContextAddition ?? {}
  objectAssign(pageContextAddendum, {
    _redirect: url,
    _statusCode: statusCode
  })
  return RenderAbort(pageContextAddendum)
}

/**
 * Abort the current page rendering, and render another page instead (while preserivng the current URL unlike redirect() which changes the URL).
 *
 * https://vite-plugin-ssr.com/abort
 *
 * @param url The URL to render.
 * @param pageContextAddition [Optional] Add pageContext values.
 */
function renderUrl(url: string, pageContextAddition?: Record<string, unknown>): Error {
  assertPageContextProvidedByUser(pageContextAddition, { abort: 'renderUrl' })
  const pageContextAddendum = pageContextAddition ?? {}
  objectAssign(pageContextAddendum, {
    _renderUrl: url
  })
  return RenderAbort(pageContextAddendum)
}

/**
 * Abort the current page rendering, and render the error page instead (for example a 404 or 401 page).
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
  assertPageContextProvidedByUser(pageContextAddition, { abort: 'renderErrorPage' })
  assertStatusCode(statusCode, [401, 403, 404, 429, 500, 503], 'renderErrorPage')
  const pageContextAddendum = pageContextAddition ?? {}
  objectAssign(pageContextAddendum, {
    _statusCode: statusCode,
    errorReason,
    is404: statusCode === 404
  })
  return RenderAbort(pageContextAddendum)
}

type PageContextRenderAbort = Record<string, unknown>
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
  checkType<RenderAbortError>(err)
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
  assertPageContextProvidedByUser(pageContext, { abort: 'RenderErrorPage' })
  let statusCode: 404 | 500 = 404
  let errorReason = 'Page Not Found'
  if (pageContext.is404 === false || (pageContext.pageProps as any)?.is404 === false) {
    statusCode = 500
    errorReason = 'Something went wrong'
  }
  return renderErrorPage(statusCode, errorReason, pageContext)
}

const stamp = '__isRenderAbort'
type RenderAbortError = { _pageContextAddition: Record<string, unknown> & PageContextRenderAbort }
function isRenderAbort(thing: unknown): thing is RenderAbortError {
  return typeof thing === 'object' && thing !== null && stamp in thing
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
