export { redirect }
export { renderUrl }
export { renderErrorPage }
export { isRenderAbort }
export { RenderErrorPage }

import { assertPageContextProvidedByUser } from '../assertPageContextProvidedByUser'
import { assertWarning, objectAssign } from './utils'

/**
 * Abort the current page rendering, and redirect the user to another URL.
 *
 * https://vite-plugin-ssr.com/abort
 */
function redirect(statusCode: '307' | '301', url: string, pageContext?: Record<string, unknown>): Error {
  assertPageContextProvidedByUser(pageContext, { abort: 'redirect' })
  const pageContextAddendum = pageContext ?? {}
  objectAssign(pageContextAddendum, {
    _redirect: { statusCode, url }
  })
  return RenderAbort(pageContextAddendum)
}

/**
 * Abort the current page rendering, and render another page instead (while preserivng the current URL unlike redirect() which changes the URL).
 *
 * https://vite-plugin-ssr.com/abort
 */
function renderUrl(url: string, pageContext?: Record<string, unknown>): Error {
  assertPageContextProvidedByUser(pageContext, { abort: 'renderUrl' })
  const pageContextAddendum = pageContext ?? {}
  objectAssign(pageContextAddendum, {
    _renderUrl: { url }
  })
  return RenderAbort(pageContextAddendum)
}

/**
 * Abort the current page rendering, and render the error page instead (for example a 404 or 401 page).
 *
 * https://vite-plugin-ssr.com/abort
 */
function renderErrorPage(
  statusCode: '404' | '400' | '401',
  reason: string,
  pageContext?: Record<string, unknown>
): Error {
  assertPageContextProvidedByUser(pageContext, { abort: 'renderErrorPage' })
  const pageContextAddendum = pageContext ?? {}
  objectAssign(pageContextAddendum, {
    _renderErrorPage: { statusCode, reason }
  })
  return RenderAbort(pageContextAddendum)
}

type PageContextRenderAbort =
  | {
      _redirect: { statusCode: string; url: string }
    }
  | {
      _renderUrl: { url: string }
    }
  | {
      _renderErrorPage: { statusCode: string; reason: string }
    }
function RenderAbort(pageContext: PageContextRenderAbort): Error {
  const err = new Error('RenderAbort')
  objectAssign(err, { pageContext, [stamp]: true })
  return err
}

/**
 * @deprecated Use `throw renderErrorPage()`, `throw renderUrl()` or `throw redirect()` instead.
 *
 *  See https://vite-plugin-ssr.com/abort'
 */
function RenderErrorPage({ pageContext }: { pageContext?: Record<string, unknown> } = {}): Error {
  /*
  assertWarning(
    false,
    '`throw RenderErrorPage()` is deprecated and will be removed in the next major release. Use `throw renderErrorPage()`, `throw renderUrl()` or `throw redirect()` instead, see https://vite-plugin-ssr.com/abort'
  )
  */
  assertPageContextProvidedByUser(pageContext, { abort: 'RenderErrorPage' })
  return renderErrorPage('404', 'Page Not Found', pageContext)
}

const stamp = '__isRenderAbort'
function isRenderAbort(thing: unknown): thing is { pageContext: Record<string, unknown> & PageContextRenderAbort } {
  return typeof thing === 'object' && thing !== null && stamp in thing
}
