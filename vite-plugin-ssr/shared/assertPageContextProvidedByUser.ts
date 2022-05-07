import { assert, assertUsage, isObject } from './utils'

export { assertPageContextProvidedByUser }

function assertPageContextProvidedByUser(
  pageContextProvidedByUser: unknown,
  {
    hook,
    errorMessagePrefix,
  }: {
    hook?: { hookFilePath: string; hookName: 'onBeforeRender' | 'render' | 'onBeforeRoute' }
    errorMessagePrefix?: string
  },
): asserts pageContextProvidedByUser is Record<string, unknown> {
  if (!errorMessagePrefix) {
    assert(hook)
    const { hookName, hookFilePath } = hook
    assert(hookFilePath.startsWith('/'))
    assert(!hookName.endsWith(')'))
    errorMessagePrefix = `The \`pageContext\` provided by the \`export { ${hookName} }\` of ${hookFilePath}`
  }

  assertUsage(isObject(pageContextProvidedByUser), `${errorMessagePrefix} should be an object.`)

  assertUsage(
    !('_objectCreatedByVitePluginSsr' in pageContextProvidedByUser),
    `${errorMessagePrefix} should not be the whole \`pageContext\` object, see https://vite-plugin-ssr.com/pageContext-manipulation#do-not-return-entire-pagecontext`,
  )
  // In principle, it's possible to use `onBeforeRoute()` to overwrite and define the whole routing.
  // But, I don't know whether that's a thing we want to allow. Beyond deep integration with Vue Router or React Router, is there a use case for this?
  // If you want this, hit me up on GitHub/Discord.
  assert(!('_pageId' in pageContextProvidedByUser))
}
