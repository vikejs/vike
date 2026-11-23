import { assert, describe, expect, it } from 'vitest'
import { getPageContext, providePageContext } from './getPageContext.js'
import { getAsyncLocalStorage } from './asyncHook.js'
import { getPageContextPublicServer } from './renderPageServer/getPageContextPublicServer.js'
import { execHookSingleWithReturn } from '../../shared-server-client/hooks/execHook.js'
import { createPageContextObject } from '../../shared-server-client/createPageContextShared.js'
import { objectAssign } from '../../utils/objectAssign.js'
import type { PageContextServer } from '../../types/PageContext.js'

describe('getPageContext()', () => {
  it('returns null to another request, upon a hook called by Vike', async () => {
    const reads = await runTwoRequests(async (shared) => {
      await shared
      return await execHookOfRequestA(() => getUrlOfPageContext())
    })
    expect(reads).toEqual({ hookOfA: '/a', requestB: null })
  })

  it('returns null to another request and after the hook, upon a hook called by an extension', async () => {
    // E.g. vike-react's +onRenderHtml hook: it awaits, then calls +onAfterRenderHtml inside providePageContext()
    const requestA = async (shared: Promise<void>) =>
      await execHookOfRequestA(async () => {
        const pageContext = getPageContext<PageContextServer>()
        await shared
        const hookOfExtension = providePageContext(pageContext, () => getUrlOfPageContext())
        // E.g. a component rendered upon HTML streaming: useConfig() must not take the pageContext of the hook
        return { hookOfExtension, afterwards: getUrlOfPageContext() }
      })
    const expected = { hookOfA: { hookOfExtension: '/a', afterwards: null }, requestB: null }
    expect(await runTwoRequests(requestA)).toEqual(expected)
    // No AsyncLocalStorage store, e.g. Cloudflare without `nodejs_compat`
    expect(await runTwoRequests(requestA, false)).toEqual(expected)
  })
})

// Request A and request B are woken up by the same promise: B's continuation is already queued when A's continuation runs
async function runTwoRequests(requestA: (shared: Promise<void>) => Promise<unknown>, withStore = true) {
  const asyncLocalStorage = await getAsyncLocalStorage()
  assert(asyncLocalStorage)
  const runRequest = <RequestReturn>(requestId: number, request: () => RequestReturn) =>
    withStore ? asyncLocalStorage.run({ requestId }, request) : request()
  const shared = new Promise<void>((resolve) => setTimeout(resolve, 0))
  const [hookOfA, requestB] = await Promise.all([
    runRequest(1, () => requestA(shared)),
    runRequest(2, async () => {
      await shared
      return getUrlOfPageContext()
    }),
  ])
  return { hookOfA, requestB }
}

async function execHookOfRequestA(hookFn: () => unknown) {
  const hook = {
    hookName: 'data' as const,
    hookFilePath: '/pages/+data.js',
    hookFn,
    hookTimeout: { error: false as const, warning: false as const },
  }
  const { hookReturn } = await execHookSingleWithReturn(hook, createPageContext('/a'), getPageContextPublicServer)
  return hookReturn
}

function createPageContext(urlOriginal: string) {
  const globalContext = {
    _isOriginalObject: true as const,
    isGlobalContext: true as const,
    _pageConfigGlobal: { configValues: {} },
  }
  const pageContext = createPageContextObject()
  objectAssign(pageContext, { isClientSide: false, _globalContext: globalContext, urlOriginal })
  return pageContext
}

function getUrlOfPageContext() {
  return getPageContext<PageContextServer>()?.urlOriginal ?? null
}
