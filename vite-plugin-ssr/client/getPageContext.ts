import { assertUsage, assertWarning, checkType, getCurrentUrl, objectAssign } from './utils'
import type { PageContextBuiltInClient } from './types'
import { releasePageContext } from './releasePageContext'
import { getPageContextSerializedInHtml } from './getPageContextSerializedInHtml'
import { getPageFilesAllClientSide } from '../shared/getPageFiles'
import { loadPageFilesClientSide } from '../shared/getPageFiles/analyzePageClientSide/loadPageFilesClientSide'

export { getPageContext }

const urlOriginal = getCurrentUrl({ withoutHash: true })

async function getPageContext() {
  const pageContext = getPageContextSerializedInHtml()
  objectAssign(pageContext, { isHydration: true })

  objectAssign(pageContext, await loadPageFilesClient(pageContext._pageId))

  assertPristineUrl()
  const pageContextReadyForRelease = releasePageContext(pageContext)
  checkType<PageContextBuiltInClient>(pageContextReadyForRelease)
  return pageContextReadyForRelease
}

function assertPristineUrl() {
  const urlCurrent = getCurrentUrl({ withoutHash: true })
  assertUsage(
    urlOriginal === urlCurrent,
    `URL manipulated before hydration finished (\`${urlOriginal}\` to \`${urlCurrent}\`). Ensure the hydration finishes with \`onHydrationEnd()\` before manipulating the URL.`,
  )
}

async function loadPageFilesClient(pageId: string) {
  const pageContextAddendum = {}
  const { pageFilesAll } = getPageFilesAllClientSide()
  objectAssign(pageContextAddendum, {
    _pageFilesAll: pageFilesAll,
  })
  {
    const { exports, exportsAll, pageExports, pageFilesLoaded } = await loadPageFilesClientSide(pageFilesAll, pageId)
    objectAssign(pageContextAddendum, {
      exports,
      exportsAll,
      pageExports,
      _pageFilesLoaded: pageFilesLoaded,
    })
  }
  pageFilesAll
    .filter((p) => p.fileType !== '.page.server')
    .forEach((p) => {
      assertWarning(
        !p.fileExports?.onBeforeRender,
        `\`export { onBeforeRender }\` of ${p.filePath} is loaded in the browser but never executed (because you are using Server-side Routing). In order to reduce the size of you browser-side JavaScript, define \`onBeforeRender()\` in \`.page.server.js\` instead. See https://vite-plugin-ssr.com/onBeforeRender-isomorphic#server-routing`,
        { onlyOnce: true },
      )
    })
  return pageContextAddendum
}
