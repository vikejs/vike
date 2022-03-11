import { assertWarning, checkType, getUrlPathname, objectAssign } from './utils'
import type { PageContextBuiltInClient } from './types'
import { releasePageContext } from './releasePageContext'
import { getPageContextSerializedInHtml } from './getPageContextSerializedInHtml'
import { getPageFilesAllClientSide, loadPageFiles } from '../shared/getPageFiles'

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
  assertWarning(
    urlPathnameOriginal === urlPathnameCurrent,
    `\`getPage()\` returned page information for URL \`${urlPathnameOriginal}\` instead of \`${urlPathnameCurrent}\`. If you want to be able to change the URL (e.g. with \`window.history.pushState\`) while using \`getPage()\`, then create a new GitHub issue.`,
  )
}

async function loadPageFilesClient(pageId: string) {
  const pageContextAddendum = {}
  const { pageFilesAll } = getPageFilesAllClientSide()
  objectAssign(pageContextAddendum, {
    _pageFilesAll: pageFilesAll,
  })
  objectAssign(pageContextAddendum, await loadPageFiles(pageFilesAll, pageId, true))
  pageFilesAll
    .filter((p) => p.fileType !== '.page.server')
    .forEach((p) => {
      assertWarning(
        !p.fileExports?.onBeforeRender,
        `\`export { onBeforeRender }\` of ${p.filePath} is loaded in the browser but never executed (because you are using Server-side Routing). In order to reduce the size of you browser-side JavaScript, define \`onBeforeRender()\` in \`.page.server.js\` instead. See https://vite-plugin-ssr.com/onBeforeRender-isomorphic#server-routing`,
      )
    })
  return pageContextAddendum
}
