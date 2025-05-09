export { createPageContextClientSide }

import { assertUsage, augmentType, objectAssign } from './utils.js'
import { getPageContextSerializedInHtml } from '../shared/getJsonSerializedInHtml.js'
import { loadPageConfigsLazyClientSide } from '../shared/loadPageConfigsLazyClientSide.js'
import { getCurrentUrl } from '../shared/getCurrentUrl.js'

import { createPageContextShared } from '../../shared/createPageContextShared.js'
import { getGlobalContextClientInternal } from './globalContext.js'

const urlFirst = getCurrentUrl({ withoutHash: true })

async function createPageContextClientSide() {
  const globalContext = await getGlobalContextClientInternal()

  const pageContextCreated = {
    isPageContext: true as const,
    _isOriginalObject: true as const,
    /* Don't spread globalContext for now? Or never spread it as it leads to confusion? The convenience isn't worth the added confusion?
    ...globalContext, // least precedence
    */
    globalContext,
    _pageFilesAll: globalContext._pageFilesAll,
    _pageConfigs: globalContext._pageConfigs,
    _pageConfigGlobal: globalContext._pageConfigGlobal,
    _allPageIds: globalContext._allPageIds,
    isPrerendering: false as const,
    isClientSide: true as const,
    isHydration: true as const,
    isBackwardNavigation: null,
    _hasPageContextFromServer: true as const
  }
  objectAssign(pageContextCreated, getPageContextSerializedInHtml())

  // Sets pageContext.config to global configs
  const pageContextAugmented = await createPageContextShared(
    pageContextCreated,
    globalContext._pageConfigGlobal,
    globalContext._userFriendlyConfigsGlobal
  )
  augmentType(pageContextCreated, pageContextAugmented)

  // Sets pageContext.config to local configs (overrides the pageContext.config set above)
  objectAssign(
    pageContextCreated,
    await loadPageConfigsLazyClientSide(
      pageContextCreated.pageId,
      pageContextCreated._pageFilesAll,
      pageContextCreated._pageConfigs,
      pageContextCreated._pageConfigGlobal
    )
  )

  assertPristineUrl()
  return pageContextCreated
}

function assertPristineUrl() {
  const urlCurrent = getCurrentUrl({ withoutHash: true })
  assertUsage(
    urlFirst === urlCurrent,
    `The URL was manipulated before the hydration finished ('${urlFirst}' to '${urlCurrent}'). Ensure the hydration has finished before manipulating the URL. Consider using the onHydrationEnd() hook.`
  )
}
