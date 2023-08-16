import { assert, assertUsage, assertWarning, isObject } from './utils.js'

export { assertPageContextProvidedByUser }

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
  const errPrefix = `The \`pageContext\` object provided by the ${
    hookName as string
  }() hook defined by ${hookFilePath}` as const

  assertUsage(
    isObject(pageContextProvidedByUser),
    `${errPrefix} should be an object instead of \`${typeof pageContextProvidedByUser}\``
  )

  assertUsage(
    !('_objectCreatedByVitePluginSsr' in pageContextProvidedByUser),
    `${errPrefix} shouldn't be the whole \`pageContext\` object, see https://vite-plugin-ssr.com/pageContext-manipulation#do-not-return-entire-pagecontext`
  )

  // In principle, it's possible to use onBeforeRoute()` to override and define the whole routing.
  // Is that a good idea to allow users to do this? Beyond deep integration with Vue Router or React Router, is there a use case for this?
  assertWarning(
    !('_pageId' in pageContextProvidedByUser),
    `${errPrefix} sets \`pageContext._pageId\` which means that vite-plugin-ssr's routing is overriden. This is an experimental feature: make sure to contact a vite-plugin-ssr maintainer before using this.`,
    { onlyOnce: true }
  )

  assertUsage(
    !('is404' in pageContextProvidedByUser),
    `${errPrefix} sets \`pageContext.is404\` which is forbidden, use \`throw render()\` instead, see https://vite-plugin-ssr.com/render`
  )
}
