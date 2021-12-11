import { determinePageIds } from '../../shared/determinePageIds'
import { getAllPageFiles } from '../../shared/getPageFiles'
import { loadPageRoutes } from '../../shared/route'
import {
  parseUrl,
  assert,
  assertBaseUrl,
  hasProp,
  objectAssign,
  PromiseType,
} from '../../shared/utils'

export { getGlobalContext }
export type { ServerFiles }

let globalContext: PromiseType<ReturnType<typeof retrieveGlobalContext>>

async function getGlobalContext() {
  if (!globalContext) {
    globalContext = await retrieveGlobalContext()
  }
  return globalContext
}

type ServerFiles = { filePath: string; fileExports: { hasExportOnBeforeRender: boolean } }[]
async function retrieveGlobalContext() {
  const globalContext = {
    _getUrlNormalized: (pageContext: { url: string; _baseUrl: string }) =>
      getUrlNormalized(pageContext.url, pageContext._baseUrl),
    _baseUrl: import.meta.env.BASE_URL,
  }
  assertBaseUrl(globalContext._baseUrl)

  const allPageFiles = await getAllPageFiles()
  objectAssign(globalContext, { _allPageFiles: allPageFiles })

  const allPageIds = await determinePageIds(allPageFiles)
  objectAssign(globalContext, { _allPageIds: allPageIds })

  const { pageRoutes, onBeforeRouteHook } = await loadPageRoutes(globalContext)
  objectAssign(globalContext, { _pageRoutes: pageRoutes, _onBeforeRouteHook: onBeforeRouteHook })

  const serverFiles: ServerFiles = []
  await Promise.all(
    allPageFiles['.page.server'].map(async ({ filePath, loadFile }) => {
      const fileExports = await loadFile()
      assert(hasProp(fileExports, 'hasExportOnBeforeRender', 'boolean'))
      assert(Object.keys(fileExports).length === 1)
      serverFiles.push({ filePath, fileExports })
    }),
  )

  objectAssign(globalContext, { _serverFiles: serverFiles })

  return globalContext
}

function getUrlNormalized(url: string, baseUrl: string) {
  assert(url)
  const { pathnameWithoutBaseUrl, hasBaseUrl } = parseUrl(url, baseUrl)
  assert(hasBaseUrl, { url, baseUrl })
  const urlNormalized = pathnameWithoutBaseUrl
  assert(urlNormalized.startsWith('/'))
  return urlNormalized
}
