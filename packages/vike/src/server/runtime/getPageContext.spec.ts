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

  it('returns null to another request, upon a hook called by an extension', async () => {
    const reads = await runTwoRequests(async (shared) => {
      // E.g. vike-react's +onRenderHtml hook: it awaits, then calls providePageContext() before calling +onAfterRenderHtml
      return await execHookOfRequestA(async () => {
        const pageContext = getPageContext<PageContextServer>()
        await shared
        providePageContext(pageContext)
        return getUrlOfPageContext()
      })
    })
    expect(reads).toEqual({ hookOfA: '/a', requestB: null })
  })
})

// Request A and request B are woken up by the same promise: B's continuation is already queued when A's continuation runs
async function runTwoRequests(requestA: (shared: Promise<void>) => Promise<unknown>) {
  const asyncLocalStorage = await getAsyncLocalStorage()
  assert(asyncLocalStorage)
  const shared = new Promise<void>((resolve) => setTimeout(resolve, 0))
  const [hookOfA, requestB] = await Promise.all([
    asyncLocalStorage.run({ requestId: 1 }, () => requestA(shared)),
    asyncLocalStorage.run({ requestId: 2 }, async () => {
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
