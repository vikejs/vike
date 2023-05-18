import { assert, assertUsage, assertWarning, isObject, isCallable, isPromise } from './utils'

export { assertPageContextProvidedByUser }

function assertPageContextProvidedByUser(
  pageContextProvidedByUser: unknown,
  {
    hook,
    errorMessagePrefix,
    canBePromise
  }: {
    hook?: {
      hookFilePath: string
      hookName: 'onBeforeRender' | 'onRenderHtml' | 'render' | 'onBeforeRoute'
    }
    errorMessagePrefix?: string
    canBePromise?: boolean
  }
): asserts pageContextProvidedByUser is Record<string, unknown> {
  if (!errorMessagePrefix) {
    assert(hook)
    const { hookName, hookFilePath } = hook
    assert(!hookName.endsWith(')'))
    errorMessagePrefix = `The \`pageContext\` provided by the ${hookName}() hook defined by ${hookFilePath}`
  }

  if (canBePromise && !isObject(pageContextProvidedByUser)) {
    assertUsage(
      isCallable(pageContextProvidedByUser) || isPromise(pageContextProvidedByUser),
      `${errorMessagePrefix} should be an object, or an async function https://vite-plugin-ssr.com/stream#initial-data-after-stream-end`
    )
    return
  }

  assertUsage(isObject(pageContextProvidedByUser), `${errorMessagePrefix} should be an object.`)

  assertUsage(
    !('_objectCreatedByVitePluginSsr' in pageContextProvidedByUser),
    `${errorMessagePrefix} should not be the whole \`pageContext\` object, see https://vite-plugin-ssr.com/pageContext-manipulation#do-not-return-entire-pagecontext`
  )
  // In principle, it's possible to use `onBeforeRoute()` to override and define the whole routing.
  // Is that a good idea to allow users to do this? Beyond deep integration with Vue Router or React Router, is there a use case for this?
  assertWarning(
    !('_pageId' in pageContextProvidedByUser),
    'You are using `onBeforeRoute()` to override vite-plugin-ssr routing. This is experimental: make sure to contact a vite-plugin-ssr maintainer before using this.',
    { showStackTrace: false, onlyOnce: true }
  )
}
