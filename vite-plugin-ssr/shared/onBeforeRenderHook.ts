import { isObject, assert, assertUsage, hasProp, isCallable } from './utils'

export { getOnBeforeRenderHook }
export { runOnBeforeRenderHooks }
export { assertUsageServerHooksCalled }
export type { OnBeforeRenderHook }

type OnBeforeRenderHook = {
  callHook: (pageContext: Record<string, unknown>) => Promise<{ pageContext: Record<string, unknown> }>
}

function getOnBeforeRenderHook(
  fileExports: Record<string, unknown>,
  filePath: string,
  required: true
): OnBeforeRenderHook
function getOnBeforeRenderHook(fileExports: Record<string, unknown>, filePath: string): null | OnBeforeRenderHook
function getOnBeforeRenderHook(
  fileExports: Record<string, unknown>,
  filePath: string,
  required?: true
): null | OnBeforeRenderHook {
  if (required) {
    assertUsage(hasProp(fileExports, 'onBeforeRender'), `${filePath} should \`export { onBeforeRender }\`.`)
  } else {
    if (!hasProp(fileExports, 'onBeforeRender')) {
      return null
    }
  }
  assertUsage(
    isCallable(fileExports.onBeforeRender),
    `The \`export { onBeforeRender }\` of ${filePath} should be a function.`
  )
  const onBeforeRenderHook = {
    async callHook(pageContext: Record<string, unknown>) {
      assert(isCallable(fileExports.onBeforeRender))
      const hookReturn = await fileExports.onBeforeRender(pageContext)
      if (hookReturn === undefined || hookReturn === null) {
        return { pageContext: {} }
      }
      assertUsage(
        hasProp(hookReturn, 'pageContext', 'object'),
        `The \`onBeforeRender()\` hook exported by ${filePath} should return \`undefined\`, \`null\`, or \`{ pageContext: { /*...*/ }}\` (a JavaScript object with a single key \`pageContext\`).`
      )
      const pageContextAddendum = hookReturn.pageContext
      return { pageContext: pageContextAddendum }
    }
  }
  return onBeforeRenderHook
}

async function runOnBeforeRenderHooks(
  pageFile: null | {
    onBeforeRenderHook: null | OnBeforeRenderHook
    fileExports: { skipDefaultOnBeforeRenderHook?: boolean }
  },
  defaultFile: null | { filePath: string; onBeforeRenderHook: null | OnBeforeRenderHook },
  pageContextOriginal: { _pageId: string } & Record<string, unknown>
): Promise<Record<string, unknown>> {
  assert(defaultFile === null || defaultFile.filePath.includes('_default'))

  let pageHookWasCalled: boolean = false

  const pageContextAddendum = {}

  if (defaultFile?.onBeforeRenderHook && !pageFile?.fileExports.skipDefaultOnBeforeRenderHook) {
    const hookReturn = await defaultFile.onBeforeRenderHook.callHook({
      ...pageContextOriginal,
      runPageOnBeforeRenderHook
    })
    assert(isObject(hookReturn.pageContext))
    Object.assign(pageContextAddendum, hookReturn.pageContext)
    assertUsage(
      !pageFile?.onBeforeRenderHook || pageHookWasCalled,
      `The page \`${pageContextOriginal._pageId}\` has a \`onBeforeRender()\` hook defined in ${pageFile} as well as in ${defaultFile}. Either \`export const skipDefaultOnBeforeRenderHook = true\` in ${pageFile} or call \`const { pageContext: pageContextAddendum } = await pageContext.runPageOnBeforeRenderHook(pageContext)\` in the \`onBeforeRender()\` hook defined in ${defaultFile} — see https://vite-plugin-ssr.com/onBeforeRender`
    )
  } else {
    if (pageFile?.onBeforeRenderHook) {
      const hookReturn = await runPageOnBeforeRenderHook(pageContextOriginal)
      assert(isObject(hookReturn.pageContext))
      Object.assign(pageContextAddendum, hookReturn.pageContext)
    }
  }

  assert(!pageFile?.onBeforeRenderHook || pageHookWasCalled)

  return pageContextAddendum

  async function runPageOnBeforeRenderHook(pageContextProvided?: Record<string, unknown>) {
    assertUsage(
      pageHookWasCalled === false,
      'You already called `pageContext.runPageOnBeforeRenderHook()`; you cannot call it a second time.'
    )
    pageHookWasCalled = true
    if (!pageFile?.onBeforeRenderHook) {
      return { pageContext: {} }
    }
    const { onBeforeRenderHook } = pageFile
    const hookResult = await onBeforeRenderHook.callHook(pageContextProvided || pageContextOriginal)
    assert('pageContext' in hookResult)
    return hookResult
  }
}

function assertUsageServerHooksCalled(args: {
  hooksServer: (string | null | undefined)[]
  hooksIsomorphic: (string | null | undefined)[]
  serverHooksCalled: boolean
  _pageId: string
}) {
  const hooksIsomorphic: string[] = args.hooksIsomorphic.filter(isFilePath)
  assert(hooksIsomorphic.length > 0)
  const hooksServer: string[] = args.hooksServer.filter(isFilePath)
  ;[...hooksIsomorphic, ...hooksServer].forEach((filePath) => filePath.startsWith('/'))
  if (hooksServer.length > 0) {
    assertUsage(
      args.serverHooksCalled,
      [
        `The page \`${args._pageId}\` has \`onBeforeRender()\` hooks defined in \`.page.js\` as well as in \`.page.server.js\` files:`,
        `\`export { onBeforeRender }\` in`,
        hooksIsomorphic[0],
        hooksIsomorphic[1] ? ` and ${hooksIsomorphic[1]}` : null,
        '(`.page.js`)',
        `as well as \`export { onBeforeRender }\` in`,
        hooksServer[0],
        hooksServer[1] ? ` and ${hooksServer[1]}` : null,
        '(`.page.server.js`).',
        `Either \`export const skipServerOnBeforeRenderHooks = true\``,
        `or call \`const { pageContext: pageContextAddendum } = await pageContext.runServerOnBeforeRenderHooks()\` in \`onBeforeRender()\` in`,
        hooksIsomorphic[0],
        hooksIsomorphic[1] ? ` or ${hooksIsomorphic[1]}` : null,
        '— see https://vite-plugin-ssr.com/onBeforeRender'
      ]
        .filter(Boolean)
        .join(' ')
    )
  }

  return

  function isFilePath(v: string | undefined | null): v is string {
    if (typeof v === 'string') {
      assert(v.startsWith('/'))
      return true
    }
    assert(v === undefined || v === null)
    return false
  }
}
