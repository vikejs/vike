export { createPageContextClientSide }

import { assertUsage, augmentType, objectAssign } from './utils.js'
import { getPageContextSerializedInHtml } from '../shared/getJsonSerializedInHtml.js'
import {
  loadPageConfigsLazyClientSide,
  type PageContext_loadPageConfigsLazyClientSide,
} from '../shared/loadPageConfigsLazyClientSide.js'
import { getCurrentUrl } from '../shared/getCurrentUrl.js'

import { createPageContextObject, createPageContextShared } from '../../shared/createPageContextShared.js'
import { getGlobalContextClientInternal } from './globalContext.js'
import {
  preparePageContextForPublicUsageClient,
  type PageContextForPublicUsageClient,
} from './preparePageContextForPublicUsageClient.js'
import { execHook } from '../../shared/hooks/execHook.js'

const urlFirst = getCurrentUrl({ withoutHash: true })

async function createPageContextClientSide() {
  const globalContext = await getGlobalContextClientInternal()

  const pageContextCreated = createPageContextObject()
  objectAssign(pageContextCreated, {
    isClientSide: true as const,
    isPrerendering: false as const,
    isHydration: true as const,
    _globalContext: globalContext,
    _pageFilesAll: globalContext._pageFilesAll, // TODO/v1-release: remove
    isBackwardNavigation: null,
    _hasPageContextFromServer: true as const,
  })
  objectAssign(pageContextCreated, getPageContextSerializedInHtml())

  // Sets pageContext.config to global configs
  augmentType(
    pageContextCreated,
    await createPageContextShared(
      pageContextCreated,
      globalContext._pageConfigGlobal,
      globalContext._vikeConfigPublicGlobal,
    ),
  )

  // Sets pageContext.config to local configs (overrides the pageContext.config set above)
  augmentType(pageContextCreated, await loadPageConfigsLazyClientSideAndExecHook(pageContextCreated))

  assertPristineUrl()
  return pageContextCreated
}

function assertPristineUrl() {
  const urlCurrent = getCurrentUrl({ withoutHash: true })
  assertUsage(
    urlFirst === urlCurrent,
    `The URL was manipulated before the hydration finished ('${urlFirst}' to '${urlCurrent}'). Ensure the hydration has finished before manipulating the URL. Consider using the onHydrationEnd() hook.`,
  )
}

type PageContextExecHook_ = Omit<
  PageContextForPublicUsageClient,
  keyof Awaited<ReturnType<typeof loadPageConfigsLazyClientSide>>
>
async function loadPageConfigsLazyClientSideAndExecHook<
  PageContext extends PageContext_loadPageConfigsLazyClientSide & PageContextExecHook_,
>(pageContext: PageContext) {
  const pageContextAddendum = await loadPageConfigsLazyClientSide(
    pageContext.pageId,
    pageContext._pageFilesAll,
    pageContext._globalContext._pageConfigs,
    pageContext._globalContext._pageConfigGlobal,
  )
  objectAssign(pageContext, pageContextAddendum)

  await execHook('onCreatePageContext', pageContext, preparePageContextForPublicUsageClient)

  return pageContext
}
