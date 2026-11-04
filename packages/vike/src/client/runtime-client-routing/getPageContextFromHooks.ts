export { getPageContextFromHooksClient }
export { getPageContextFromHooksClient_firstRender }
export { getPageContextFromHooksServer }
export { getPageContextFromHooksServer_firstRender }
export { getPageContextFromHooksServer_errorPage }
export { setPageContextInitIsPassedToClient }
export { processPageContextFromServer }
export type { PageContextFromHooksServer }

import { assert, assertUsage, getProjectError } from '../../utils/assert.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { hasProp } from '../../utils/hasProp.js'
import { isObject } from '../../utils/isObject.js'
import { objectAssign } from '../../utils/objectAssign.js'
import { redirectHard } from '../../utils/redirectHard.js'
import { getPageContextSerializedInHtml } from '../shared/getJsonSerializedInHtml.js'
import { readPageContextJson } from './streamedValues.js'
import type { PageContextConfig, PageFile } from '../../shared-server-client/getPageFiles.js'
import { analyzePageServerSide } from '../../shared-server-client/getPageFiles/analyzePageServerSide.js'
import { removeBuiltInOverrides } from './getPageContext/removeBuiltInOverrides.js'
import { type ErrorPageInfo, getPageContextRequestUrl } from '../../shared-server-client/getPageContextRequestUrl.js'
import { getPageConfig } from '../../shared-server-client/page-configs/helpers.js'
import { getConfigValueRuntime } from '../../shared-server-client/page-configs/getConfigValueRuntime.js'
import { assertOnBeforeRenderHookReturn } from '../../shared-server-client/assertOnBeforeRenderHookReturn.js'
import { execHookGuard } from '../../shared-server-client/route/execHookGuard.js'
import { AbortRender, isAbortPageContext } from '../../shared-server-client/route/abort.js'
import { pageContextInitIsPassedToClient } from '../../shared-server-client/misc/pageContextInitIsPassedToClient.js'
import { execHook } from '../../shared-server-client/hooks/execHook.js'
import type { HookName } from '../../types/Config.js'
import type { PageContextCreatedClient } from './createPageContextClient.js'
import type { PageContextBegin } from './renderPageClient.js'
import { type PageContextPublicClient, getPageContextPublicClient } from './getPageContextPublicClient.js'
import type { ConfigEnv } from '../../types/index.js'
import type { GlobalContextClientInternal } from './getGlobalContextClientInternal.js'
import '../assertEnvClient.js'
const globalObject = getGlobalObject<{
  pageContextInitIsPassedToClient?: true
}>('getPageContextFromHooks.ts', {})

// TO-DO/soon/cumulative-hooks: filter & execute all client-only hooks (see other TO-DO/soon/cumulative-hooks comments)
// - The client-side needs to know what hooks are client-only
//   - Possible implementation: new computed prop `clientOnlyHooks: string[]` (list of hook ids) and add `hookId` to serialized config values
const clientHooks = ['guard', 'data', 'onBeforeRender'] as const

type PageContextSerialized = {
  pageId: string
  _hasPageContextFromServer: true
}
// Get `pageContext` values from `<script id="vike_pageContext" type="application/json">`
async function getPageContextFromHooksServer_firstRender(abortSignal: AbortSignal): Promise<
  PageContextSerialized & {
    routeParams: Record<string, string>
    _hasPageContextFromServer: true
  }
> {
  const pageContextSerialized = await getPageContextSerializedInHtml(abortSignal)
  processPageContextFromServer(pageContextSerialized)
  objectAssign(pageContextSerialized, {
    _hasPageContextFromServer: true as const,
  })
  return pageContextSerialized
}
async function getPageContextFromHooksClient_firstRender(
  pageContext: PageContextSerialized &
    PageContextBegin &
    PageContextConfig & { _hasPageContextFromServer: true } & PageContextPublicClient,
) {
  for (const hookName of clientHooks) {
    if (!hookClientOnlyExists(hookName, pageContext)) continue
    if (hookName === 'guard') {
      await execHookGuardClient(pageContext)
    } else {
      await execHookDataLike(hookName, pageContext)
    }
  }
  return pageContext
}

type PageContextFromHooksServer = { _hasPageContextFromServer: boolean }
async function getPageContextFromHooksServer(
  pageContext: { pageId: string; abortSignal: AbortSignal } & PageContextCreatedClient,
): Promise<
  | { is404ServerSideRouted: true }
  | {
      is404ServerSideRouted?: undefined
      pageContextFromHooksServer: PageContextFromHooksServer
    }
> {
  const pageContextFromHooksServer = {
    _hasPageContextFromServer: false,
  }

  // If pageContextInit has some client data or if one of the hooks guard(), data() or onBeforeRender() is server-side
  // only, then we need to fetch pageContext from the server.
  // We do it before executing any client-side hook, because it contains pageContextInit which may be needed for guard() / data() / onBeforeRender(), for example pageContextInit.user is crucial for guard()
  if (
    // true if pageContextInit has some client data or at least one of the data() and onBeforeRender() hooks is server-side only:
    await hasPageContextServer(pageContext)
  ) {
    const res = await fetchPageContextFromServer(pageContext)
    if (res.is404ServerSideRouted) return res
    objectAssign(pageContextFromHooksServer, res.pageContextFromServer)
  }

  // We cannot return the whole pageContext because this function is used for prefetching `pageContext` (which requires a partial pageContext to be merged with the future pageContext created upon rendering the page in the future).
  return { pageContextFromHooksServer }
}

async function getPageContextFromHooksClient(
  pageContext: { pageId: string; _hasPageContextFromServer: boolean } & PageContextBegin &
    PageContextConfig &
    PageContextPublicClient,
  isErrorPage: boolean,
) {
  let dataHookExecuted = false
  // At this point, we need to call the client-side guard(), data() and onBeforeRender() hooks, if they exist on client
  // env. However if we have fetched pageContext from the server, some of them might have run already on the
  // server-side, so we run only the client-only ones in this case.
  // Note: for the error page, we also execute the client-side data() and onBeforeRender() hooks, but maybe we
  // shouldn't? The server-side does it as well (but maybe it shouldn't).
  for (const hookName of clientHooks) {
    if (!hookClientOnlyExists(hookName, pageContext) && pageContext._hasPageContextFromServer) continue
    if (hookName === 'guard') {
      if (isErrorPage) continue
      await execHookGuardClient(pageContext)
    } else {
      if (hookName === 'data') dataHookExecuted = true
      await execHookDataLike(hookName, pageContext)
    }
  }

  // Execute +onData
  const dataHookEnv = getHookEnv('data', pageContext)
  if ((dataHookExecuted && dataHookEnv.client) || (pageContext._hasPageContextFromServer && dataHookEnv.server)) {
    await execHookClient('onData', pageContext)
  }

  const pageContextFromHooksClient = pageContext
  return pageContextFromHooksClient
}

type PageContextExecHookClient = PageContextCreatedClient & PageContextConfig & PageContextPublicClient
async function execHookClient(hookName: HookName, pageContext: PageContextExecHookClient) {
  return await execHook(hookName, pageContext, (p) => getPageContextPublicClient(p))
}

// It's a no-op if:
// - No hook has been defined, or
// - The hook's `env.client` is `false`
async function execHookDataLike(hookName: 'data' | 'onBeforeRender', pageContext: PageContextExecHookClient) {
  let pageContextFromHook: Record<string, unknown> | undefined
  if (hookName === 'data') {
    pageContextFromHook = await execHookData(pageContext)
  } else {
    pageContextFromHook = await execHookOnBeforeRender(pageContext)
  }
  Object.assign(pageContext, pageContextFromHook)
}
async function execHookData(pageContext: PageContextExecHookClient) {
  const res = await execHookClient('data', pageContext)
  const hook = res[0] // TO-DO/soon/cumulative-hooks: support cumulative
  if (!hook) return
  const { hookReturn } = hook
  const pageContextAddendum = { data: hookReturn }
  return pageContextAddendum
}
async function execHookOnBeforeRender(pageContext: PageContextExecHookClient) {
  const res = await execHookClient('onBeforeRender', pageContext)
  const hook = res[0] // TO-DO/soon/cumulative-hooks: support cumulative
  if (!hook) return
  const { hookReturn, hookFilePath } = hook
  const pageContextFromHook = {}
  assertOnBeforeRenderHookReturn(hookReturn, hookFilePath)
  // Note: hookReturn looks like { pageContext: { ... } }
  const pageContextFromOnBeforeRender = hookReturn?.pageContext
  if (pageContextFromOnBeforeRender) {
    objectAssign(pageContextFromHook, pageContextFromOnBeforeRender)
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

// TO-DO/next-major-release: make it sync
async function hasPageContextServer(pageContext: {
  pageId: string
  _globalContext: GlobalContextClientInternal
  _pageFilesAll: PageFile[]
}): Promise<boolean> {
  if (isOldDesign(pageContext)) {
    const { hasOnBeforeRenderServerSideOnlyHook } = await analyzePageServerSide(
      pageContext._pageFilesAll,
      pageContext.pageId,
    )
    // data() hooks didn't exist in the V0.4 design
    return hasOnBeforeRenderServerSideOnlyHook
  }
  return !!globalObject.pageContextInitIsPassedToClient || hasServerOnlyHook(pageContext)
}

function hasServerOnlyHook(pageContext: {
  pageId: string
  _globalContext: GlobalContextClientInternal
}) {
  if (isOldDesign(pageContext)) return false
  const pageConfig = getPageConfig(pageContext.pageId, pageContext._globalContext._pageConfigs)
  const val = getConfigValueRuntime(pageConfig, `hasServerOnlyHook`)?.value
  assert(val === true || val === false)
  return val
}

function hookClientOnlyExists(
  hookName: 'data' | 'onBeforeRender' | 'guard',
  pageContext: {
    pageId: string
    _globalContext: GlobalContextClientInternal
  },
): boolean {
  const hookEnv = getHookEnv(hookName, pageContext)
  return !!hookEnv.client && !hookEnv.server
}
function getHookEnv(
  hookName: 'data' | 'onBeforeRender' | 'guard',
  pageContext: {
    pageId: string
    _globalContext: GlobalContextClientInternal
  },
) {
  if (isOldDesign(pageContext)) {
    // Client-only onBeforeRender(), data(), or guard() hooks were never supported for the V0.4 design
    return { client: false, server: true }
  }
  const pageConfig = getPageConfig(pageContext.pageId, pageContext._globalContext._pageConfigs)
  // No runtime validation to save client-side KBs
  const hookEnv = (getConfigValueRuntime(pageConfig, `${hookName}Env`)?.value ?? {}) as ConfigEnv
  return hookEnv
}

// The error page's pageContext
async function getPageContextFromHooksServer_errorPage(
  pageContext: {
    pageId: string
    abortSignal: AbortSignal
    isClientSideNavigation: boolean
    abortStatusCode?: number
    abortReason?: unknown
  } & PageContextCreatedClient,
  err: unknown,
): Promise<(PageContextFromHooksServer & { is404ServerSideRouted?: undefined }) | { is404ServerSideRouted: true }> {
  if (
    !globalThis.__VIKE__FETCH_PAGE_CONTEXT_OF_ERROR_PAGE_FROM_SERVER // Save client-side KBs
  ) {
    return { _hasPageContextFromServer: false }
  }
  assert(hasServerOnlyHook(pageContext))

  // The server already sent the error page's pageContext when a server-side error occurs upon a normal page (a page that isn't the error page)
  if (hasProp(err, _pageContextErrorPage, 'object')) {
    return { _hasPageContextFromServer: true, ...err[_pageContextErrorPage] }
  }

  const { abortStatusCode, abortReason } = pageContext
  const res = await fetchPageContextFromServer(pageContext, { abortStatusCode, abortReason })

  if (res.is404ServerSideRouted) return res
  const { pageContextFromServer } = res

  // This assert() might fail: https://github.com/vikejs/vike/pull/3636#issuecomment-6563275899
  assert(pageContextFromServer.pageId === pageContext.pageId) // `errorPageId`

  // The server's abortReason is the copy that the `_vike` search param carried as JSON (e.g. a `Date` arrives as a
  // string) — we keep the client-side lossless version
  delete pageContextFromServer.abortReason

  return pageContextFromServer
}

async function fetchPageContextFromServer(
  pageContext: {
    urlOriginal: string
    _urlRewrite?: string
    abortSignal: AbortSignal
    isClientSideNavigation?: boolean
  },
  errorPageInfo?: ErrorPageInfo,
) {
  const pageContextUrl = getPageContextRequestUrl(pageContext._urlRewrite ?? pageContext.urlOriginal, errorPageInfo)
  const errMsg = `${pageContextUrl} couldn't be fetched`

  // Navigating away aborts the request, including the streamed values that are still pending
  // - https://vike.dev/passToClient#streaming
  const response = await fetch(pageContextUrl, { signal: pageContext.abortSignal })

  // Assert Content-Type
  const contentType = response.headers.get('content-type')
  const contentTypeCorrect = 'application/json'
  if (!contentType || !contentType.includes(contentTypeCorrect)) {
    // Static host + new deployment: when .pageContext.json doesn't exist because a newer deployment removed the page => static hosts answers 404
    // - The error page's .pageContext.json is also missing when, e.g., a tab runs the bundle of an older deployment that had a server, or the server's build has no error page
    if (response.status === 404) {
      if (
        errorPageInfo &&
        // Reloading upon the first render would lead to an infinite reload loop: the reloaded page fails again and requests the error page's .pageContext.json again
        !pageContext.isClientSideNavigation
      ) {
        throw getProjectError(errMsg)
      }
      redirectHard(pageContext.urlOriginal)
      return { is404ServerSideRouted: true as const }
    }
    assertUsage(
      false,
      `Wrong Content-Type for ${pageContextUrl}: it should be ${contentTypeCorrect} but it's ${contentType} instead. Make sure to properly use pageContext.httpResponse.headers, see https://vike.dev/renderPage`,
    )
  }

  const pageContextFromServer = await readPageContextJson(response, pageContext.abortSignal)
  assert(isObject(pageContextFromServer))
  if (
    // The response of `throw redirect()`, `throw render(url)` and `{ serverSideError: true }` isn't a page's pageContext
    'pageId' in pageContextFromServer
  ) {
    processPageContextFromServer(pageContextFromServer)
  }

  // Handle server-side `throw redirect()` / `throw render()`
  if (
    !errorPageInfo && // The error page's pageContext can have `abortStatusCode` but it isn't an abort
    isAbortPageContext(pageContextFromServer)
  ) {
    const err = AbortRender(pageContextFromServer)
    attachPageContextErrorPage(err, pageContextFromServer)
    throw err
  }

  if (
    'serverSideError' in pageContextFromServer ||
    // The server couldn't render the page being navigated to and sent the error page's pageContext instead => we throw an error => the error handling of renderPageClient() renders the error page (while automatically picking up the error page's pageContext from `err._pageContextErrorPage`)
    (pageContextFromServer.isErrorPage && !errorPageInfo)
  ) {
    const err = getProjectError(`${errMsg} because an error occurred on the server-side`)
    attachPageContextErrorPage(err, pageContextFromServer)
    throw err
  }

  objectAssign(pageContextFromServer, { _hasPageContextFromServer: true as const })
  return { pageContextFromServer }
}
const _pageContextErrorPage = '_pageContextErrorPage'
function attachPageContextErrorPage(err: Error, pageContextFromServer: Record<string, unknown>) {
  if (pageContextFromServer.isErrorPage) {
    // A server-side hook of the page being navigated to threw an error or called `throw render(abortStatusCode)`, and the server already sent the error page's pageContext instead: keep it, so that the client renders the error page with it
    // - Otherwise the client fetches it again (and the error page's server-side hooks run twice)
    objectAssign(err, { [_pageContextErrorPage]: pageContextFromServer })
  }
}

function processPageContextFromServer(pageContext: Record<string, unknown>) {
  assertUsage(!('urlOriginal' in pageContext), "Adding 'urlOriginal' to passToClient is forbidden")
  assert(hasProp(pageContext, 'pageId', 'string'))
  removeBuiltInOverrides(pageContext)
}

// TO-DO/next-major-release: remove
function isOldDesign(pageContext: {
  pageId: string
  _globalContext: GlobalContextClientInternal
}) {
  return pageContext._globalContext._pageConfigs.length === 0
}

async function execHookGuardClient(
  pageContext: Parameters<typeof execHookGuard>[0] & Parameters<typeof getPageContextPublicClient>[0],
) {
  await execHookGuard(pageContext, (pageContext) => getPageContextPublicClient(pageContext))
}
