import { PageFile3 } from '../getPageFiles'
import { isErrorPage } from './error-page'
import { assert, assertExports, assertUsage, hasProp, objectAssign, slice } from './utils'
import type { OnBeforeRouteHook } from './callOnBeforeRouteHook'
import { getFilesystemRoute } from './resolveFilesystemRoute'

export { loadPageRoutes }
export type { PageRoutes }

type PageRoutes = {
  pageId: string
  pageRouteFile?: {
    filePath: string
    fileExports: Record<string, unknown> & {
      default: RouteValue
      iKnowThePerformanceRisksOfAsyncRouteFunctions?: boolean
    }
    routeValue: RouteValue
  }
  filesystemRoute: string
}[]

type RouteValue = string | Function

async function loadPageRoutes(pageContext: {
  _pageFilesAll: PageFile3[]
  _allPageIds: string[]
}): Promise<{ pageRoutes: PageRoutes; onBeforeRouteHook: null | OnBeforeRouteHook }> {
  let onBeforeRouteHook: null | OnBeforeRouteHook = null
  const filesystemRoots: { rootPath: string; rootValue: string }[] = []

  await Promise.all(
    pageContext._pageFilesAll.filter((p) => p.fileType === '.page.route').map((p) => p.loadFileExports?.()),
  )

  pageContext._pageFilesAll
    .filter((p) => p.fileType === '.page.route' && p.isDefaultPageFile)
    .map(async ({ filePath, fileExports }) => {
      assert(fileExports)
      assertExportsOfDefaulteRoutePage(fileExports, filePath)
      if ('onBeforeRoute' in fileExports) {
        assertUsage(
          hasProp(fileExports, 'onBeforeRoute', 'function'),
          `The \`onBeforeRoute\` export of \`${filePath}\` should be a function.`,
        )
        const { onBeforeRoute } = fileExports
        onBeforeRouteHook = { filePath, onBeforeRoute }
      }
      if ('filesystemRoutingRoot' in fileExports) {
        assertUsage(
          hasProp(fileExports, 'filesystemRoutingRoot', 'string'),
          `The \`filesystemRoutingRoot\` export of \`${filePath}\` should be a string.`,
        )
        assertUsage(
          hasProp(fileExports, 'filesystemRoutingRoot', 'string'),
          `The \`filesystemRoutingRoot\` export of \`${filePath}\` is \`'${fileExports.filesystemRoutingRoot}'\` but it should start with a leading slash \`/\`.`,
        )
        filesystemRoots.push({
          rootPath: dirname(filePath),
          rootValue: fileExports.filesystemRoutingRoot,
        })
      }
    })

  const allPageIds = pageContext._allPageIds
  const pageRoutes: PageRoutes = []
  allPageIds
    .filter((pageId) => !isErrorPage(pageId))
    .map(async (pageId) => {
      const filesystemRoute = getFilesystemRoute(pageId, filesystemRoots)
      assert(filesystemRoute.startsWith('/'))
      assert(!filesystemRoute.endsWith('/') || filesystemRoute === '/')
      const pageRoute = {
        pageId,
        filesystemRoute,
      }

      const pageRouteFile = pageContext._pageFilesAll.find(
        ({ fileType, pageId }) => pageId === pageId && fileType === '.page.route',
      )
      if (pageRouteFile) {
        const { filePath, fileExports } = pageRouteFile
        assert(fileExports)
        assertExportsOfRoutePage(fileExports, filePath)
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
        objectAssign(pageRoute, {
          pageRouteFile: { filePath, fileExports, routeValue },
        })
        pageRoutes.push(pageRoute)
      } else {
        pageRoutes.push(pageRoute)
      }
    })

  return { pageRoutes, onBeforeRouteHook }
}

function assertExportsOfRoutePage(fileExports: Record<string, unknown>, filePath: string) {
  assertExports(fileExports, filePath, ['default', 'iKnowThePerformanceRisksOfAsyncRouteFunctions'])
}
function assertExportsOfDefaulteRoutePage(fileExports: Record<string, unknown>, filePath: string) {
  assertExports(fileExports, filePath, ['onBeforeRoute', 'filesystemRoutingRoot'], {
    ['_onBeforeRoute']: 'onBeforeRoute',
  })
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
