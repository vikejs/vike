import { assertWarning, checkType, getUrlPathname, objectAssign } from './utils'
import type { PageContextBuiltInClient } from './types'
import { releasePageContext } from './releasePageContext'
import { getPageContextSerializedInHtml } from './getPageContextSerializedInHtml'
import { getPageFilesAllClientSide, loadPageFiles } from '../shared/getPageFiles'

export { getPage }

const urlPathnameOriginal = getUrlPathname()

async function getPage<T = PageContextBuiltInClient>(): Promise<PageContextBuiltInClient & T> {
  const pageContext = getPageContextSerializedInHtml()
  objectAssign(pageContext, { isHydration: true })

  objectAssign(pageContext, await loadPageFilesServer(pageContext))

  assertPristineUrl()

  const pageContextReadyForRelease = releasePageContext(pageContext)
  checkType<PageContextBuiltInClient>(pageContextReadyForRelease)
  return pageContextReadyForRelease as any as PageContextBuiltInClient & T
}

function assertPristineUrl() {
  const urlPathnameCurrent = getUrlPathname()
  assertWarning(
    urlPathnameOriginal === urlPathnameCurrent,
    `\`getPage()\` returned page information for URL \`${urlPathnameOriginal}\` instead of \`${urlPathnameCurrent}\`. If you want to be able to change the URL (e.g. with \`window.history.pushState\`) while using \`getPage()\`, then create a new GitHub issue.`,
  )
}

async function loadPageFilesServer(pageContext: { _pageId: string }) {
  const pageContextAddendum = {}
  const { pageFilesAll } = getPageFilesAllClientSide()
  objectAssign(pageContextAddendum, await loadPageFiles(pageFilesAll, pageContext._pageId, true))
  pageFilesAll
    .filter((p) => p.fileType !== '.page.server')
    .forEach((p) => {
      assertWarning(
        !p.fileExports?.onBeforeRender,
        `${p.filePath} has \`export { onBeforeRender }\` which is (wastefully) loaded but not used on the client-side. You are using Server Routing you should therefore define \`onBeforeRender()\` in \`.page.server.js\` instead. See https://vite-plugin-ssr.com/onBeforeRender-isomorphic#server-routing`,
      )
    })
  return pageContextAddendum
}
