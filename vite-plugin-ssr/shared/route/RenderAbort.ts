export { isRenderAbort }
export { RenderErrorPage }

import { assertPageContextProvidedByUser } from '../assertPageContextProvidedByUser'
import { assertUsage, objectAssign } from './utils'
const stamp = '__isRenderErrorPageException'

function isRenderAbort(thing: unknown): thing is { pageContext?: Record<string, unknown> } {
  assertRenderErrorPageExceptionUsage(thing)
  return typeof thing === 'object' && thing !== null && stamp in thing
}

/** Interrupt the rendering of the current page, and render something else instead.
 *
 * https://vite-plugin-ssr.com/RenderErrorPage
 */
function RenderErrorPage({ pageContext }: { pageContext?: Record<string, unknown> } = {}): Error {
  {
    // @ts-ignore
    const that: unknown = this
    assertUsage(
      !(typeof that === 'object' && that?.constructor === RenderErrorPage),
      "Don't use the `new` operator: use `throw RenderErrorPage()` instead of `throw new RenderErrorPage()`.",
      { showStackTrace: true }
    )
  }
  if (pageContext !== undefined) {
    assertPageContextProvidedByUser(pageContext, {
      errorMessagePrefix: 'The `pageContext` object provided by `throw RenderErrorPage({ pageContext })`',
      isRenderErrorPage: true
    })
  }

  const err = new Error('RenderErrorPage')
  objectAssign(err, { pageContext, [stamp]: true })
  return err
}

function assertRenderErrorPageExceptionUsage(err: unknown): void {
  assertUsage(
    err !== RenderErrorPage,
    'Missing parentheses `()` in `throw RenderErrorPage`: it should be `throw RenderErrorPage()`.',
    { showStackTrace: true }
  )
}
