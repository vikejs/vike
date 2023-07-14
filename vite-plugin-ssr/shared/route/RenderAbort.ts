export { redirect }
export { renderUrl }
export { renderErrorPage }
export { isAbortError }
export { logAbortErrorHandled }
export { RenderErrorPage }
export { getPageContextFromRewrite }
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
    _abortCallerArgs: [String(statusCode)],
    urlRedirect: url
  })
  return RenderAbort(pageContextAddition)
}

/**
 * Abort the current page rendering, and render another page instead (while preserivng the current URL, unlike redirect() which changes the URL).
 *
 * https://vite-plugin-ssr.com/abort
 *
 * @param urlRewrite The URL to render.
 * @param pageContextAddition [Optional] Add pageContext values.
 */
function renderUrl(urlRewrite: string, pageContextAddition?: Record<string, unknown>): Error {
  const abortCaller = 'renderUrl' as const
  assertPageContextProvidedByUser(pageContextAddition, { abortCaller })
  pageContextAddition = pageContextAddition ?? {}
  objectAssign(pageContextAddition, {
    _renderUrl: urlRewrite,
    _abortCaller: abortCaller,
    _abortCallerArgs: [`'${urlRewrite}'`],
    urlRewrite
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
    _abortCaller: abortCaller,
    _abortCallerArgs: [String(statusCode), `'${errorReason}'`]
  })
  return RenderAbort(pageContextAddition)
}

// /** Num */
// function a(i1: number): any;
// /** Str */
// function a(i2: string): any;
// function a(i: any) {
// }
// a
// a('a')
// a(1)

type PageContextRenderAbort = Record<string, unknown> & {
  _abortCallerArgs: string[]
} & (
    | {
        _abortCaller: 'redirect'
        urlRedirect: string
      }
    | {
        _abortCaller: 'renderUrl'
        urlRewrite: string
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
  pageContext: { urlOriginal: string; urlRewrite?: null | string }
) {
  if (isProduction) return
  const { _abortCaller: abortCaller, _abortCallerArgs: abortCallerArgs } = err._pageContextAddition
  const urlCurrent = pageContext.urlRewrite ?? pageContext.urlOriginal
  assert(urlCurrent)
  // TODO: add color for server-side
  const msgIntro = `throw ${abortCaller}(${abortCallerArgs.join(', ')})`
  assertInfo(false, `${msgIntro} while rendering URL '${urlCurrent}' (this log isn't shown in production)`, {
    onlyOnce: false
  })
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

type PageContextFromRewrite = { urlRewrite: string } & Record<string, unknown>
function getPageContextFromRewrite(
  pageContextsFromRewrite: PageContextFromRewrite[]
): { urlRewrite: null | string } & Record<string, unknown> {
  assertNotInfiniteLoop(pageContextsFromRewrite)
  const pageContextFromRewriteFirst = pageContextsFromRewrite[0]
  if (!pageContextFromRewriteFirst) return { urlRewrite: null }
  const pageContextFromAllRewrites = pageContextFromRewriteFirst
  pageContextsFromRewrite.forEach((pageContextFromRewrite) => {
    Object.assign(pageContextFromAllRewrites, pageContextFromRewrite)
  })
  return pageContextFromAllRewrites
}
function assertNotInfiniteLoop(pageContextsFromRewrite: PageContextFromRewrite[]) {
  const urlRewrites: string[] = []
  pageContextsFromRewrite.forEach(({ urlRewrite }) => {
    {
      const idx = urlRewrites.indexOf(urlRewrite)
      if (idx !== -1) {
        const loop: string = [...urlRewrites.slice(idx), urlRewrite].map((url) => `renderUrl(${url})`).join(' => ')
        assertUsage(false, `Infinite loop of renderUrl() calls: ${loop}`)
      }
    }
    urlRewrites.push(urlRewrite)
  })
}
