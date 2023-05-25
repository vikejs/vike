import { assert, assertUsage, assertWarning, isObject } from './utils'

export { assertPageContextProvidedByUser }

function assertPageContextProvidedByUser(
  pageContextProvidedByUser: unknown,
  {
    hook,
    errorMessagePrefix,
    isRenderErrorPage
  }:
    | {
        hook?: undefined
        isRenderErrorPage: true
        errorMessagePrefix: `The \`pageContext\` object provided by \`throw RenderErrorPage({ pageContext })\``
      }
    | {
        hook: {
          hookFilePath: string
          hookName: 'onBeforeRender' | 'onRenderHtml' | 'render' | 'onBeforeRoute'
        }
        isRenderErrorPage?: undefined
        errorMessagePrefix?: undefined
      }
): asserts pageContextProvidedByUser is Record<string, unknown> {
  const errPrefix = (() => {
    if (errorMessagePrefix) {
      return errorMessagePrefix
    } else {
      assert(hook)
      const { hookName, hookFilePath } = hook
      assert(!hookName.endsWith(')'))
      return `The \`pageContext\` object provided by the ${
        hookName as string
      }() hook defined by ${hookFilePath}` as const
    }
  })()

  assertUsage(
    isObject(pageContextProvidedByUser),
    `${errPrefix} should be an object instead of \`${typeof pageContextProvidedByUser}\``
  )

  assertUsage(
    !('_objectCreatedByVitePluginSsr' in pageContextProvidedByUser),
    `${errPrefix} shouldn't be the whole \`pageContext\` object, see https://vite-plugin-ssr.com/pageContext-manipulation#do-not-return-entire-pagecontext`
  )

  // In principle, it's possible to use `onBeforeRoute()` to override and define the whole routing.
  // Is that a good idea to allow users to do this? Beyond deep integration with Vue Router or React Router, is there a use case for this?
  assertWarning(
    !('_pageId' in pageContextProvidedByUser),
    `${errPrefix} sets \`pageContext._pageId\` which means that vite-plugin-ssr's routing is overriden. This is an experimental feature: make sure to contact a vite-plugin-ssr maintainer before using this.`,
    { showStackTrace: false, onlyOnce: true }
  )
}
