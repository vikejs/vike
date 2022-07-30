export { isRenderErrorPageException }
export { RenderErrorPage }
export { assertRenderErrorPageExceptionUsage }

import { assertPageContextProvidedByUser } from '../../shared/assertPageContextProvidedByUser'
import { assert, assertUsage, objectAssign, isBrowser } from '../utils'
const stamp = '__isRenderErrorPageException'

assert(!isBrowser())

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
      'Do not use the `new` operator: use `throw RenderErrorPage()` instead of `throw new RenderErrorPage()`.',
    )
  }
  assertPageContextProvidedByUser(pageContext, {
    errorMessagePrefix: 'The `pageContext` provided in `RenderErrorPage({ pageContext })`',
  })

  const err = new Error('RenderErrorPage')
  objectAssign(err, { pageContext, [stamp]: true })
  return err
}

function assertRenderErrorPageExceptionUsage(err: unknown) {
  assertUsage(
    err !== RenderErrorPage,
    'Missing parentheses `()` in `throw RenderErrorPage`: it should be `throw RenderErrorPage()`.',
  )
}
