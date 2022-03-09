import { assertWarning, objectAssign } from './utils'
import { getPageFilesAllClientSide, loadPageFiles2 } from '../shared/getPageFiles'

export { loadPageFiles }

async function loadPageFiles(pageContext: { _pageId: string }) {
  const pageContextAddendum = {}
  const { pageFilesAll } = getPageFilesAllClientSide()
  objectAssign(pageContextAddendum, await loadPageFiles2(pageFilesAll, pageContext._pageId, true))
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
