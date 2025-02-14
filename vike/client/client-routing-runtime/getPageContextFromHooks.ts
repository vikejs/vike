export { getPageContextFromHooks_isHydration }
export { getPageContextFromHooks_serialized }
export { getPageContextFromServerHooks }
export { getPageContextFromClientHooks }
export { setPageContextInitIsPassedToClient }
export type { PageContextFromServerHooks }
export type { PageContextFromClientHooks }

import {
  assert,
  assertUsage,
  hasProp,
  objectAssign,
  getProjectError,
  redirectHard,
  executeHook,
  isObject,
  getGlobalObject
} from './utils.js'
import { parse } from '@brillout/json-serializer/parse'
import { getPageContextSerializedInHtml } from '../shared/getPageContextSerializedInHtml.js'
import type { PageConfigUserFriendlyOld, PageFile } from '../../shared/getPageFiles.js'
import { analyzePageServerSide } from '../../shared/getPageFiles/analyzePageServerSide.js'
import { getHook } from '../../shared/hooks/getHook.js'
import { preparePageContextForUserConsumptionClientSide } from '../shared/preparePageContextForUserConsumptionClientSide.js'
import { removeBuiltInOverrides } from './getPageContext/removeBuiltInOverrides.js'
import { getPageContextRequestUrl } from '../../shared/getPageContextRequestUrl.js'
import type { PageConfigRuntime } from '../../shared/page-configs/PageConfig.js'
import { getPageConfig } from '../../shared/page-configs/helpers.js'
import { getConfigValueRuntime } from '../../shared/page-configs/getConfigValueRuntime.js'
import { assertOnBeforeRenderHookReturn } from '../../shared/assertOnBeforeRenderHookReturn.js'
import { executeGuardHook } from '../../shared/route/executeGuardHook.js'
import { AbortRender, isAbortPageContext } from '../../shared/route/abort.js'
import { pageContextInitIsPassedToClient } from '../../shared/misc/pageContextInitIsPassedToClient.js'
import { isServerSideError } from '../../shared/misc/isServerSideError.js'
const globalObject = getGlobalObject<{ pageContextInitIsPassedToClient?: true }>(
  'client-routing-runtime/getPageContextFromHooks.ts',
  {}
)

// TODO/eventually: rename
type PageContext = {
  urlOriginal: string
  _urlRewrite: string | null
  _pageFilesAll: PageFile[]
  _pageConfigs: PageConfigRuntime[]
}

type PageContextSerialized = {
  pageId: string
  _hasPageContextFromServer: true
}
// TODO/eventually: rename
function getPageContextFromHooks_serialized(): PageContextSerialized & {
  routeParams: Record<string, string>
  _hasPageContextFromServer: true
} {
  const pageContextSerialized = getPageContextSerializedInHtml()
  assertUsage(!('urlOriginal' in pageContextSerialized), "Adding 'urlOriginal' to passToClient is forbidden")
  processPageContextFromServer(pageContextSerialized)
  objectAssign(pageContextSerialized, {
    _hasPageContextFromServer: true as const
  })
  return pageContextSerialized
}
// TODO/eventually: rename
async function getPageContextFromHooks_isHydration(
  pageContext: PageContextSerialized & PageContext & PageConfigUserFriendlyOld & { _hasPageContextFromServer: true }
) {
  objectAssign(pageContext, {
    _hasPageContextFromClient: false
  })
  for (const hookName of ['data', 'onBeforeRender'] as const) {
    if (hookClientOnlyExists(hookName, pageContext)) {
      const pageContextFromHook = await executeHookClientSide(hookName, pageContext)
      assert(!('urlOriginal' in pageContextFromHook))
      Object.assign(pageContext, pageContextFromHook)
    }
  }
  return pageContext
}

type PageContextFromServerHooks = { _hasPageContextFromServer: boolean }
async function getPageContextFromServerHooks(
  pageContext: { pageId: string } & PageContext,
  isErrorPage: boolean
): Promise<
  | { is404ServerSideRouted: true }
  | {
      is404ServerSideRouted?: undefined
      pageContextFromServerHooks: PageContextFromServerHooks
    }
> {
  const pageContextFromServerHooks = {
    _hasPageContextFromServer: false
  }

  // If pageContextInit has some client data or if one of the hooks guard(), data() or onBeforeRender() is server-side
  // only, then we need to fetch pageContext from the server.
  // We do it before executing any client-side hook, because it contains pageContextInit which may be needed for guard() / data() / onBeforeRender(), for example pageContextInit.user is crucial for guard()
  if (
    // For the error page, we cannot fetch pageContext from the server because the pageContext JSON request is based on the URL
    !isErrorPage &&
    // true if pageContextInit has some client data or at least one of the data() and onBeforeRender() hooks is server-side only:
    (await hasPageContextServer(pageContext))
  ) {
    const res = await fetchPageContextFromServer(pageContext)
    if ('is404ServerSideRouted' in res) return { is404ServerSideRouted: true as const }
    const { pageContextFromServer } = res
    pageContextFromServerHooks._hasPageContextFromServer = true

    // Already handled
    assert(!(isServerSideError in pageContextFromServer))
    assert(!('serverSideError' in pageContextFromServer))

    objectAssign(pageContextFromServerHooks, pageContextFromServer)
  }

  // We cannot return the whole pageContext because this function is used for prefetching `pageContext` (which requires a partial pageContext to be merged with the future pageContext created upon rendering the page in the future).
  return { pageContextFromServerHooks }
}

type PageContextFromClientHooks = { _hasPageContextFromClient: boolean }
async function getPageContextFromClientHooks(
  pageContext: { pageId: string; _hasPageContextFromServer: boolean } & PageContext & PageConfigUserFriendlyOld,
  isErrorPage: boolean
): Promise<PageContextFromClientHooks> {
  objectAssign(pageContext, {
    _hasPageContextFromClient: false
  })

  // At this point, we need to call the client-side guard(), data() and onBeforeRender() hooks, if they exist on client
  // env. However if we have fetched pageContext from the server, some of them might have run already on the
  // server-side, so we run only the client-only ones in this case.
  // Note: for the error page, we also execute the client-side data() and onBeforeRender() hooks, but maybe we
  // shouldn't? The server-side does it as well (but maybe it shouldn't).
  for (const hookName of ['guard', 'data', 'onBeforeRender'] as const) {
    if (hookName === 'guard') {
      if (
        !isErrorPage &&
        // We don't need to call guard() on the client-side if we fetch pageContext from the server side. (Because the `${url}.pageContext.json` HTTP request will already trigger the routing and guard() hook on the server-side.)
        !pageContext._hasPageContextFromServer
      ) {
        // Should we really call the guard() hook on the client-side? Shouldn't we make the guard() hook a server-side
        // only hook? Or maybe make its env configurable like data() and onBeforeRender()?
        await executeGuardHook(pageContext, (pageContext) =>
          preparePageContextForUserConsumptionClientSide(pageContext, true)
        )
      }
    } else {
      assert(hookName === 'data' || hookName === 'onBeforeRender')
      if (hookClientOnlyExists(hookName, pageContext) || !pageContext._hasPageContextFromServer) {
        // This won't do anything if no hook has been defined or if the hook's env.client is false.
        const pageContextFromHook = await executeHookClientSide(hookName, pageContext)
        assert(!('urlOriginal' in pageContextFromHook))
        Object.assign(pageContext, pageContextFromHook)
      }
    }
  }

  const pageContextFromClientHooks = pageContext
  return pageContextFromClientHooks
}

async function executeHookClientSide(
  hookName: 'data' | 'onBeforeRender',
  pageContext: {
    pageId: string
    _hasPageContextFromServer: boolean
    _hasPageContextFromClient: boolean
  } & PageConfigUserFriendlyOld &
    PageContext
) {
  const hook = getHook(pageContext, hookName)
  if (!hook) {
    // No hook defined or hook's env.client is false
    return {}
  }
  const pageContextForUserConsumption = preparePageContextForUserConsumptionClientSide(pageContext, true)
  const hookResult = await executeHook(() => hook.hookFn(pageContextForUserConsumption), hook, pageContext)

  const pageContextFromHook = {}
  if (hookName === 'onBeforeRender') {
    assertOnBeforeRenderHookReturn(hookResult, hook.hookFilePath)
    // Note: hookResult looks like { pageContext: { ... } }
    const pageContextFromOnBeforeRender = hookResult?.pageContext
    if (pageContextFromOnBeforeRender) {
      objectAssign(pageContextFromHook, { _hasPageContextFromClient: true })
      objectAssign(pageContextFromHook, pageContextFromOnBeforeRender)
    }
  } else {
    assert(hookName === 'data')
    // Note: hookResult can be anything (e.g. an object) and is to be assigned to pageContext.data
    const pageContextFromData = {
      data: hookResult
    }
    if (hookResult) {
      objectAssign(pageContextFromHook, { _hasPageContextFromClient: true })
    }
    objectAssign(pageContextFromHook, pageContextFromData)
  }
  return pageContextFromHook
}

// Workaround for the fact that the client-side cannot known whether a pageContext JSON request is needed in order to fetch pageContextInit data passed to the client.
//  - The workaround is reliable as long as the user sets additional pageContextInit to undefined instead of not defining the property:
//    ```diff
//    - // Breaks the workaround:
//    - const pageContextInit = { urlOriginal: req.url }
//    - if (user) pageContextInit.user = user
//    + // Makes the workaround reliable:
//    + const pageContextInit = { urlOriginal: req.url, user }
//    ```
// - We can show a warning to users when the pageContextInit keys aren't always the same. (We didn't implement the waning yet because it would require a new doc page https://vike.dev/pageContextInit#avoid-conditional-properties
// - Workaround cannot be made completely reliable because the workaround assumes that passToClient is always the same, but the user may set a different passToClient value for another page
// - Alternatively, we could define a new config `alwaysFetchPageContextFromServer: boolean`
function setPageContextInitIsPassedToClient(pageContext: Record<string, unknown>) {
  if (pageContext[pageContextInitIsPassedToClient]) {
    globalObject.pageContextInitIsPassedToClient = true
  }
}

// TODO/v1-release: make it sync
async function hasPageContextServer(pageContext: Parameters<typeof hookServerOnlyExists>[1]): Promise<boolean> {
  return (
    !!globalObject.pageContextInitIsPassedToClient ||
    (await hookServerOnlyExists('data', pageContext)) ||
    (await hookServerOnlyExists('onBeforeRender', pageContext))
  )
}

// TODO/v1-release: make it sync
/**
 * @param hookName
 * @param pageContext
 * @returns `true` if the given page has a `hookName` hook defined with a server-only env.
 */
async function hookServerOnlyExists(
  hookName: 'data' | 'onBeforeRender',
  pageContext: {
    pageId: string
    _pageFilesAll: PageFile[]
    _pageConfigs: PageConfigRuntime[]
  }
): Promise<boolean> {
  if (pageContext._pageConfigs.length > 0) {
    // V1
    const pageConfig = getPageConfig(pageContext.pageId, pageContext._pageConfigs)
    const hookEnv = getConfigValueRuntime(pageConfig, `${hookName}Env`)?.value
    if (hookEnv === null) return false
    assert(isObject(hookEnv))
    const { client, server } = hookEnv
    assert(client === true || client === undefined)
    assert(server === true || server === undefined)
    assert(client || server)
    return !!server && !client
  } else {
    // TODO/v1-release: remove
    // V0.4

    // data() hooks didn't exist in the V0.4 design
    if (hookName === 'data') return false

    assert(hookName === 'onBeforeRender')
    const { hasOnBeforeRenderServerSideOnlyHook } = await analyzePageServerSide(
      pageContext._pageFilesAll,
      pageContext.pageId
    )
    return hasOnBeforeRenderServerSideOnlyHook
  }
}

/**
 * @param hookName
 * @param pageContext
 * @returns `true` if the given page has a `hookName` hook defined with a client-only env.
 */
function hookClientOnlyExists(
  hookName: 'data' | 'onBeforeRender',
  pageContext: {
    pageId: string
    _pageConfigs: PageConfigRuntime[]
  }
): boolean {
  if (pageContext._pageConfigs.length > 0) {
    // V1
    const pageConfig = getPageConfig(pageContext.pageId, pageContext._pageConfigs)
    const hookEnv = getConfigValueRuntime(pageConfig, `${hookName}Env`)?.value ?? {}
    assert(isObject(hookEnv))
    return !!hookEnv.client && !hookEnv.server
  } else {
    // TODO/v1-release: remove
    // Client-only onBeforeRender() or data() hooks were never supported for the V0.4 design
    return false
  }
}

async function fetchPageContextFromServer(pageContext: { urlOriginal: string; _urlRewrite: string | null }) {
  const pageContextUrl = getPageContextRequestUrl(pageContext._urlRewrite ?? pageContext.urlOriginal)
  const response = await fetch(pageContextUrl)

  {
    const contentType = response.headers.get('content-type')
    const contentTypeCorrect = 'application/json'
    const isCorrect = contentType && contentType.includes(contentTypeCorrect)

    // Static hosts + page doesn't exist
    if (!isCorrect && response.status === 404) {
      redirectHard(pageContext.urlOriginal)
      return { is404ServerSideRouted: true }
    }

    assertUsage(
      isCorrect,
      `Wrong Content-Type for ${pageContextUrl}: it should be ${contentTypeCorrect} but it's ${contentType} instead. Make sure to properly use pageContext.httpResponse.headers, see https://vike.dev/renderPage`
    )
  }

  const responseText = await response.text()
  const pageContextFromServer: unknown = parse(responseText)
  assert(isObject(pageContextFromServer))

  if (isAbortPageContext(pageContextFromServer)) {
    throw AbortRender(pageContextFromServer)
  }

  // Is there a reason for having two different properties? Can't we use only one property? I guess/think the isServerSideError property was an attempt (a bad idea really) for rendering the error page even though an error occured on the server-side (which is a bad idea because the added complexity is non-negligible while the added value is minuscule since the error page usually doesn't have any (meaningful / server-side) hooks).
  if ('serverSideError' in pageContextFromServer || isServerSideError in pageContextFromServer) {
    throw getProjectError(`pageContext couldn't be fetched because an error occurred on the server-side`)
  }

  assert(hasProp(pageContextFromServer, 'pageId', 'string'))
  processPageContextFromServer(pageContextFromServer)

  return { pageContextFromServer }
}

function processPageContextFromServer(pageContextFromServer: Record<string, unknown>) {
  removeBuiltInOverrides(pageContextFromServer)
}
