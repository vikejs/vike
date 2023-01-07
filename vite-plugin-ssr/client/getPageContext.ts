import { assertUsage, assertWarning, checkType, getCurrentUrl, objectAssign } from './utils'
import type { PageContextBuiltInClient } from './types'
import { releasePageContext } from './releasePageContext'
import { getPageContextSerializedInHtml } from './getPageContextSerializedInHtml'
import { getPageFilesAll } from '../shared/getPageFiles'
import { loadPageFilesClientSide } from './loadPageFilesClientSide'

export { getPageContext }

const urlFirst = getCurrentUrl({ withoutHash: true })

async function getPageContext() {
  const pageContext = getPageContextSerializedInHtml()
  objectAssign(pageContext, { isHydration: true as const, isBackwardNavigation: null })

  objectAssign(pageContext, await loadPageFilesClient(pageContext._pageId))

  assertPristineUrl()
  const pageContextReadyForRelease = releasePageContext(pageContext)
  checkType<PageContextBuiltInClient>(pageContextReadyForRelease)
  return pageContextReadyForRelease
}

function assertPristineUrl() {
  const urlCurrent = getCurrentUrl({ withoutHash: true })
  assertUsage(
    urlFirst === urlCurrent,
    `URL manipulated before hydration finished (\`${urlFirst}\` to \`${urlCurrent}\`). Ensure the hydration finishes with \`onHydrationEnd()\` before manipulating the URL.`
  )
}

async function loadPageFilesClient(pageId: string) {
  const pageContextAddendum = {}
  const { pageFilesAll, pageConfigs } = await getPageFilesAll(true)
  objectAssign(pageContextAddendum, {
    _pageFilesAll: pageFilesAll,
    _pageConfigs: pageConfigs
  })

  objectAssign(pageContextAddendum, await loadPageFilesClientSide(pageFilesAll, pageConfigs, pageId))

  pageFilesAll
    .filter((p) => p.fileType !== '.page.server')
    .forEach((p) => {
      assertWarning(
        !p.fileExports?.onBeforeRender,
        `\`export { onBeforeRender }\` of ${p.filePath} is loaded in the browser but never executed (because you are using Server-side Routing). In order to reduce the size of you browser-side JavaScript, define \`onBeforeRender()\` in \`.page.server.js\` instead. See https://vite-plugin-ssr.com/onBeforeRender-isomorphic#server-routing`,
        { showStackTrace: false, onlyOnce: true }
      )
    })

  return pageContextAddendum
}
