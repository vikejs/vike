export { createPageContextClientSide }

import { assertUsage, assertWarning, augmentType, objectAssign } from './utils.js'
import { getPageContextSerializedInHtml } from '../shared/getContextSerializedInHtml.js'
import { loadUserFilesClientSide, type PageContextUserFiles } from '../shared/loadUserFilesClientSide.js'
import { getCurrentUrl } from '../shared/getCurrentUrl.js'

import { createPageContextShared } from '../../shared/createPageContextShared.js'
import { getGlobalContext } from './globalContext.js'

const urlFirst = getCurrentUrl({ withoutHash: true })

async function createPageContextClientSide() {
  const globalContext = await getGlobalContext()

  const pageContextCreated = {
    /* Don't spread globalContext for now? Or never spread it as it leads to confusion? The convenience isn't worth the added confusion?
    ...globalContext, // least precedence
    */
    globalContext,
    _pageFilesAll: globalContext._pageFilesAll,
    _pageConfigs: globalContext._pageConfigs,
    _pageConfigGlobal: globalContext._pageConfigGlobal,
    _allPageIds: globalContext._allPageIds,
    isPrerendering: false,
    isClientSide: true,
    isHydration: true as const,
    isBackwardNavigation: null,
    _hasPageContextFromServer: true as const,
    _hasPageContextFromClient: false as const
  }
  objectAssign(pageContextCreated, getPageContextSerializedInHtml())
  objectAssign(pageContextCreated, await loadPageUserFiles(pageContextCreated.pageId, pageContextCreated))

  const pageContextAugmented = await createPageContextShared(pageContextCreated, globalContext._pageConfigGlobal)
  augmentType(pageContextCreated, pageContextAugmented)

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

async function loadPageUserFiles(pageId: string, pageContext: PageContextUserFiles) {
  const pageContextAddendum = {}
  objectAssign(
    pageContextAddendum,
    await loadUserFilesClientSide(
      pageId,
      pageContext._pageFilesAll,
      pageContext._pageConfigs,
      pageContext._pageConfigGlobal
    )
  )

  pageContext._pageFilesAll
    .filter((p) => p.fileType !== '.page.server')
    .forEach((p) => {
      assertWarning(
        !p.fileExports?.onBeforeRender,
        `export { onBeforeRender } of ${p.filePath} is loaded in the browser but never executed (because you are using Server-side Routing). In order to reduce the size of you browser-side JavaScript, define onBeforeRender() in a .page.server.js file instead, see https://vike.dev/onBeforeRender-isomorphic#server-routing`,
        { onlyOnce: true }
      )
    })

  return pageContextAddendum
}
