import { PageFile } from '../getPageFiles'
import { isErrorPage } from './error-page'
import { assert, assertUsage, hasProp, objectAssign, slice } from './utils'
import type { OnBeforeRouteHook } from './callOnBeforeRouteHook'
import { FilesystemRoot, getFilesystemRoute } from './resolveFilesystemRoute'

export { loadPageRoutes }
export type { PageRoutes }

type PageRoutes = ({ pageId: string } & (
  | { filesystemRoute: string; pageRouteFile: null }
  | { filesystemRoute: null; pageRouteFile: PageRouteFile }
))[]
type PageRouteFile = {
  filePath: string
  fileExports: Record<string, unknown> & {
    default: RouteValue
    iKnowThePerformanceRisksOfAsyncRouteFunctions?: boolean
  }
  routeValue: RouteValue
}

type RouteValue = string | Function

async function loadPageRoutes(pageContext: {
  _pageFilesAll: PageFile[]
  _allPageIds: string[]
}): Promise<{ pageRoutes: PageRoutes; onBeforeRouteHook: null | OnBeforeRouteHook }> {
  let onBeforeRouteHook: null | OnBeforeRouteHook = null
  const filesystemRoots: FilesystemRoot[] = []

  await Promise.all(pageContext._pageFilesAll.filter((p) => p.fileType === '.page.route').map((p) => p.loadFile?.()))

  pageContext._pageFilesAll
    .filter((p) => p.fileType === '.page.route' && p.isDefaultPageFile)
    .map(async ({ filePath, fileExports }) => {
      assert(fileExports)
      if ('onBeforeRoute' in fileExports) {
        assertUsage(
          hasProp(fileExports, 'onBeforeRoute', 'function'),
          `\`export { onBeforeRoute }\` of ${filePath} should be a function.`,
        )
        const { onBeforeRoute } = fileExports
        onBeforeRouteHook = { filePath, onBeforeRoute }
      }
      if ('filesystemRoutingRoot' in fileExports) {
        assertUsage(
          hasProp(fileExports, 'filesystemRoutingRoot', 'string'),
          `\`export { filesystemRoutingRoot }\` of ${filePath} should be a string.`,
        )
        assertUsage(
          hasProp(fileExports, 'filesystemRoutingRoot', 'string'),
          `\`export { filesystemRoutingRoot }\` of ${filePath} is \`'${fileExports.filesystemRoutingRoot}'\` but it should start with a leading slash \`/\`.`,
        )
        filesystemRoots.push({
          filesystemRoot: dirname(filePath),
          routeRoot: fileExports.filesystemRoutingRoot,
        })
      }
    })

  const allPageIds = pageContext._allPageIds
  const pageRoutes: PageRoutes = []

  const allPageIdsWithFilesystemRoute = allPageIds
    .filter((pageId) => !isErrorPage(pageId))
    .filter(async (pageId) => {
      const pageRouteFile = pageContext._pageFilesAll.find((p) => p.pageId === pageId && p.fileType === '.page.route')
      if (!pageRouteFile) {
        return true
      }

      const { filePath, fileExports } = pageRouteFile
      assert(fileExports)
      assertUsage('default' in fileExports, `${filePath} should have a default export.`)
      assertUsage(
        hasProp(fileExports, 'default', 'string') || hasProp(fileExports, 'default', 'function'),
        `The default export of ${filePath} should be a string or a function.`,
      )
      assertUsage(
        !('iKnowThePerformanceRisksOfAsyncRouteFunctions' in fileExports) ||
          hasProp(fileExports, 'iKnowThePerformanceRisksOfAsyncRouteFunctions', 'boolean'),
        `The export \`iKnowThePerformanceRisksOfAsyncRouteFunctions\` of ${filePath} should be a boolean.`,
      )
      const routeValue: RouteValue = fileExports.default

      pageRoutes.push({
        pageId,
        pageRouteFile: { filePath, fileExports, routeValue },
        filesystemRoute: null,
      })

      return false
    })

  allPageIdsWithFilesystemRoute.forEach((pageId) => {
    const filesystemRoute = getFilesystemRoute(pageId, filesystemRoots, allPageIdsWithFilesystemRoute)
    assert(filesystemRoute.startsWith('/'))
    assert(!filesystemRoute.endsWith('/') || filesystemRoute === '/')
    const pageRoute = {
      pageId,
      filesystemRoute,
    }
    objectAssign(pageRoute, {
      pageRouteFile: null,
    })
    pageRoutes.push({
      pageId,
      filesystemRoute,
      pageRouteFile: null,
    })
  })

  return { pageRoutes, onBeforeRouteHook }
}

function dirname(filePath: string): string {
  assert(filePath.startsWith('/'))
  assert(!filePath.endsWith('/'))
  const paths = filePath.split('/')
  const dirPath = slice(paths, 0, -1).join('/') || '/'
  assert(dirPath.startsWith('/'))
  assert(!dirPath.endsWith('/') || dirPath === '/')
  return dirPath
}
