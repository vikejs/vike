export { createPageContextClientSide }

import { assertUsage, assertWarning, augmentType, objectAssign } from './utils.js'
import { getPageContextSerializedInHtml } from '../shared/getPageContextSerializedInHtml.js'
import { loadUserFilesClientSide, type PageContextUserFiles } from '../shared/loadUserFilesClientSide.js'
import { getCurrentUrl } from '../shared/getCurrentUrl.js'

import { createPageContextShared } from '../../shared/createPageContextShared.js'
import { getGlobalContext } from './globalContextClientSide.js'

const urlFirst = getCurrentUrl({ withoutHash: true })

async function createPageContextClientSide() {
  const globalContext = await getGlobalContext()

  const pageContextCreated = {
    isPrerendering: false,
    isClientSide: true,
    isHydration: true as const,
    isBackwardNavigation: null,
    _hasPageContextFromServer: true as const,
    _hasPageContextFromClient: false as const,
    globalContext,
    ...globalContext
  }
  objectAssign(pageContextCreated, getPageContextSerializedInHtml())
  objectAssign(pageContextCreated, await loadPageUserFiles(pageContextCreated.pageId, pageContextCreated))

  const pageContextAugmented = createPageContextShared(pageContextCreated, globalContext._pageConfigGlobal)
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
