import { assert, assertUsage, assertWarning, isObject } from './utils'

export { assertPageContextProvidedByUser }

function assertPageContextProvidedByUser(
  pageContextProvidedByUser: unknown,
  {
    hook,
    abortCaller
  }:
    | {
        hook?: undefined
        abortCaller: 'redirect' | 'render' | 'RenderErrorPage'
      }
    | {
        hook: {
          hookFilePath: string
          hookName: 'onBeforeRender' | 'onRenderHtml' | 'render' | 'onBeforeRoute'
        }
        abortCaller?: undefined
      }
): asserts pageContextProvidedByUser is Record<string, unknown> {
  if (pageContextProvidedByUser === undefined || pageContextProvidedByUser === null) return

  const errPrefix = (() => {
    if (abortCaller) {
      return `The \`pageContext\` object provided by \`throw ${abortCaller}()\``
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
    { onlyOnce: true }
  )

  if (!abortCaller) {
    assertUsage(
      !('is404' in pageContextProvidedByUser),
      `${errPrefix} sets \`pageContext.is404\` which is forbidden, use \`throw render()\` instead, see https://vite-plugin-ssr.com/render`
    )
  }
}
