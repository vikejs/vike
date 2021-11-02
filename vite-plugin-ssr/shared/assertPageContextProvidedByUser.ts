import { assert, assertUsage, isObject } from './utils'

export { assertPageContextProvidedByUser }

function assertPageContextProvidedByUser(
  pageContextProvidedByUser: unknown,
  hook: { hookFilePath: string; hookName: 'onBeforeRender' | 'render' | 'onBeforeRoute' }
): asserts pageContextProvidedByUser is Record<string, unknown> {
  const { hookName, hookFilePath } = hook
  assert(hookFilePath.startsWith('/'))

  const errMessagePrefix = `The hook \`export { ${hookName} }\` of ${hookFilePath} returned`

  assertUsage(
    isObject(pageContextProvidedByUser),
    `${errMessagePrefix} \`{ pageContext }\` but \`pageContext\` should be an object.`
  )

  assertUsage(
    !isWholePageContext(pageContextProvidedByUser),
    `${errMessagePrefix} the whole \`pageContext\` object which is forbidden, see https://www.vite-plugin-ssr.com/pageContext-manipulation#do-not-return-entire-pagecontext`
  )
}

function isWholePageContext(pageContextProvidedByUser: Record<string, unknown>) {
  return '_pageId' in pageContextProvidedByUser
}
