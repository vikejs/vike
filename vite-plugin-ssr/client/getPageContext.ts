import { assertUsage, assertWarning, checkType, getUrlPathname, objectAssign } from './utils'
import type { PageContextBuiltInClient } from './types'
import { releasePageContext } from './releasePageContext'
import { getPageContextSerializedInHtml } from './getPageContextSerializedInHtml'
import { getPageFilesAllClientSide } from '../shared/getPageFiles'
import { loadPageFilesClientSide } from '../shared/getPageFiles/loadPageFiles'

export { getPageContext }

const urlPathnameOriginal = getUrlPathname()

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
  const urlPathnameCurrent = getUrlPathname()
  assertUsage(
    urlPathnameOriginal === urlPathnameCurrent,
    `You changed the page's URL before the hydration finished (from \`${urlPathnameOriginal}\` to \`${urlPathnameCurrent}\`). Make sure that the hydration finished before changing the URL by using the \`onHydrationEnd()\` hook.`,
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
