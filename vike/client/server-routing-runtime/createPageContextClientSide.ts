export { createPageContextClientSide }

import { assertUsage, assertWarning, augmentType, objectAssign } from './utils.js'
import { getPageContextSerializedInHtml } from '../shared/getPageContextSerializedInHtml.js'
import { loadUserFilesClientSide } from '../shared/loadUserFilesClientSide.js'
import { getCurrentUrl } from '../shared/getCurrentUrl.js'
import { getPageConfigsRuntime } from '../../shared/getPageConfigsRuntime.js'

// @ts-ignore
import * as virtualFileExports from 'virtual:vike:importUserCode:client:server-routing'
import { createPageContextShared } from '../../shared/createPageContextShared.js'
const { pageFilesAll, pageConfigs, pageConfigGlobal } = getPageConfigsRuntime(virtualFileExports)

const urlFirst = getCurrentUrl({ withoutHash: true })

async function createPageContextClientSide() {
  const pageContextCreated = {
    isPrerendering: false,
    isClientSide: true,
    isHydration: true as const,
    isBackwardNavigation: null,
    _hasPageContextFromServer: true as const,
    _hasPageContextFromClient: false as const
  }
  objectAssign(pageContextCreated, getPageContextSerializedInHtml())
  objectAssign(pageContextCreated, await loadPageUserFiles(pageContextCreated.pageId))

  const pageContextAugmented = createPageContextShared(pageContextCreated)
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

async function loadPageUserFiles(pageId: string) {
  const pageContextAddendum = {}
  objectAssign(pageContextAddendum, {
    _pageFilesAll: pageFilesAll,
    _pageConfigs: pageConfigs,
    _pageConfigGlobal: pageConfigGlobal
  })

  objectAssign(
    pageContextAddendum,
    await loadUserFilesClientSide(
      pageId,
      pageContextAddendum._pageFilesAll,
      pageContextAddendum._pageConfigs,
      pageContextAddendum._pageConfigGlobal
    )
  )

  pageFilesAll
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
