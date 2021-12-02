import { AllPageFiles, findDefaultFiles, findPageFile } from '../getPageFiles'
import { isErrorPage } from './error-page'
import { assert, assertExports, assertUsage, hasProp, objectAssign, slice } from '../utils'
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

async function loadPageRoutes(globalContext: {
  _allPageFiles: AllPageFiles
  _allPageIds: string[]
}): Promise<{ pageRoutes: PageRoutes; onBeforeRouteHook: null | OnBeforeRouteHook }> {
  let onBeforeRouteHook: null | OnBeforeRouteHook = null
  const filesystemRoots: { rootPath: string; rootValue: string }[] = []
  const defaultPageRouteFiles = findDefaultFiles(globalContext._allPageFiles['.page.route'])
  await Promise.all(
    defaultPageRouteFiles.map(async ({ filePath, loadFile }) => {
      const fileExports = await loadFile()
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
        filesystemRoots.push({
          rootPath: dirname(filePath),
          rootValue: fileExports.filesystemRoutingRoot,
        })
      }
    }),
  )

  const allPageIds = globalContext._allPageIds
  const pageRoutes: PageRoutes = []
  await Promise.all(
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

        const pageRouteFile = findPageFile(globalContext._allPageFiles['.page.route'], pageId)
        if (pageRouteFile) {
          const { filePath, loadFile } = pageRouteFile
          const fileExports = await loadFile()
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
      }),
  )

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
