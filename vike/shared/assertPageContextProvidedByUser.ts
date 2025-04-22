export { assertPageContextProvidedByUser }

import { assert, assertUsage, assertWarning, isObject } from './utils.js'
import pc from '@brillout/picocolors'

function assertPageContextProvidedByUser(
  pageContextProvidedByUser: unknown,
  {
    hookName,
    hookFilePath
  }: {
    hookFilePath: string
    hookName: 'onBeforeRender' | 'onRenderHtml' | 'render' | 'onBeforeRoute'
  }
): asserts pageContextProvidedByUser is Record<string, unknown> {
  if (pageContextProvidedByUser === undefined || pageContextProvidedByUser === null) return

  assert(!hookName.endsWith(')'))
  const errPrefix = `The ${pc.cyan('pageContext')} object provided by the ${
    hookName as string
  }() hook defined by ${hookFilePath}` as const

  assertUsage(
    isObject(pageContextProvidedByUser),
    `${errPrefix} should be an object (but it's ${pc.cyan(
      `typeof pageContext === ${JSON.stringify(typeof pageContextProvidedByUser)}`
    )} instead)`
  )

  assertUsage(
    !('isPageContext' in pageContextProvidedByUser),
    `${errPrefix} shouldn't be the whole ${pc.cyan(
      'pageContext'
    )} object, see https://vike.dev/pageContext-manipulation#do-not-return-entire-pagecontext`
  )

  // In principle, it's possible to use onBeforeRoute()` to override and define the whole routing.
  // Is that a good idea to allow users to do this? Beyond deep integration with Vue Router or React Router, is there a use case for this?
  assertWarning(
    !('pageId' in pageContextProvidedByUser),
    `${errPrefix} sets ${pc.cyan(
      'pageContext.pageId'
    )} which means that Vike's routing is overriden. This is an experimental feature: make sure to contact a vike maintainer before using this.`,
    { onlyOnce: true }
  )

  assertUsage(
    !('is404' in pageContextProvidedByUser),
    `${errPrefix} sets ${pc.cyan('pageContext.is404')} which is forbidden, use ${pc.cyan(
      'throw render()'
    )} instead, see https://vike.dev/render`
  )
}
