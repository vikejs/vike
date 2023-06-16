export { isRenderErrorPageException }
export { RenderErrorPage }

import { assertPageContextProvidedByUser } from '../assertPageContextProvidedByUser'
import { assertUsage, objectAssign } from './utils'
const stamp = '__isRenderErrorPageException'

function isRenderErrorPageException(thing: unknown): thing is { pageContext?: Record<string, unknown> } {
  assertRenderErrorPageExceptionUsage(thing)
  return typeof thing === 'object' && thing !== null && stamp in thing
}

function RenderErrorPage({ pageContext }: { pageContext?: Record<string, unknown> } = {}) {
  {
    // @ts-ignore
    const that: unknown = this
    assertUsage(
      !(typeof that === 'object' && that?.constructor === RenderErrorPage),
      "Don't use the `new` operator: use `throw RenderErrorPage()` instead of `throw new RenderErrorPage()`."
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

function assertRenderErrorPageExceptionUsage(err: unknown) {
  assertUsage(
    err !== RenderErrorPage,
    'Missing parentheses `()` in `throw RenderErrorPage`: it should be `throw RenderErrorPage()`.'
  )
}
