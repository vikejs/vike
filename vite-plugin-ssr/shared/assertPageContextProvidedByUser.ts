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
  assert(!('_pageId' in pageContextProvidedByUser))
}
