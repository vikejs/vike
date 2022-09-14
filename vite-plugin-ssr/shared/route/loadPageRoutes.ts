import { PageFile } from '../getPageFiles'
import { isErrorPageId } from './error-page'
import { assert, assertUsage, hasProp, slice } from './utils'
import type { OnBeforeRouteHook } from './callOnBeforeRouteHook'
import { FilesystemRoot, getFilesystemRouteString } from './getFilesystemRouteString'

export { loadPageRoutes }
export { findPageRouteFile }
export type { PageRoutes }
export type { RouteType }

type PageRoutes = ({ pageId: string } & (
  | { filesystemRoute: string; pageRouteFile: null }
  | { filesystemRoute: null; pageRouteFile: PageRouteFile }
))[]
type RouteType = 'STRING' | 'FUNCTION' | 'FILESYSTEM'
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
  await Promise.all(pageContext._pageFilesAll.filter((p) => p.fileType === '.page.route').map((p) => p.loadFile?.()))

  const { onBeforeRouteHook, filesystemRoots } = findGlobalHooks(pageContext)

  const pageRoutes: PageRoutes = []
  pageContext._allPageIds
    .filter((pageId) => !isErrorPageId(pageId))
    .forEach((pageId) => {
      const pageRouteFile = findPageRouteFile(pageId, pageContext._pageFilesAll)
      if (!pageRouteFile) {
        const filesystemRouteString = getFilesystemRouteString(pageId, filesystemRoots)
        assert(filesystemRouteString.startsWith('/'))
        assert(!filesystemRouteString.endsWith('/') || filesystemRouteString === '/')
        pageRoutes.push({
          pageId,
          filesystemRoute: filesystemRouteString,
          pageRouteFile: null
        })
      } else {
        const { filePath, fileExports } = pageRouteFile
        assert(fileExports)
        assertUsage('default' in fileExports, `${filePath} should have a default export.`)
        assertUsage(
          hasProp(fileExports, 'default', 'string') || hasProp(fileExports, 'default', 'function'),
          `The default export of ${filePath} should be a string or a function.`
        )
        assertUsage(
          !('iKnowThePerformanceRisksOfAsyncRouteFunctions' in fileExports) ||
            hasProp(fileExports, 'iKnowThePerformanceRisksOfAsyncRouteFunctions', 'boolean'),
          `The export \`iKnowThePerformanceRisksOfAsyncRouteFunctions\` of ${filePath} should be a boolean.`
        )
        const routeValue: RouteValue = fileExports.default

        pageRoutes.push({
          pageId,
          filesystemRoute: null,
          pageRouteFile: { filePath, fileExports, routeValue }
        })
      }
    })

  return { pageRoutes, onBeforeRouteHook }
}

function findGlobalHooks(pageContext: { _pageFilesAll: PageFile[] }): {
  onBeforeRouteHook: null | OnBeforeRouteHook
  filesystemRoots: FilesystemRoot[]
} {
  let onBeforeRouteHook: null | OnBeforeRouteHook = null
  const filesystemRoots: FilesystemRoot[] = []
  pageContext._pageFilesAll
    .filter((p) => p.fileType === '.page.route' && p.isDefaultPageFile)
    .forEach(({ filePath, fileExports }) => {
      assert(fileExports)
      if ('onBeforeRoute' in fileExports) {
        assertUsage(
          hasProp(fileExports, 'onBeforeRoute', 'function'),
          `\`export { onBeforeRoute }\` of ${filePath} should be a function.`
        )
        const { onBeforeRoute } = fileExports
        onBeforeRouteHook = { filePath, onBeforeRoute }
      }
      if ('filesystemRoutingRoot' in fileExports) {
        assertUsage(
          hasProp(fileExports, 'filesystemRoutingRoot', 'string'),
          `\`export { filesystemRoutingRoot }\` of ${filePath} should be a string.`
        )
        assertUsage(
          hasProp(fileExports, 'filesystemRoutingRoot', 'string'),
          `\`export { filesystemRoutingRoot }\` of ${filePath} is \`'${fileExports.filesystemRoutingRoot}'\` but it should start with a leading slash \`/\`.`
        )
        filesystemRoots.push({
          filesystemRoot: dirname(filePath),
          routeRoot: fileExports.filesystemRoutingRoot
        })
      }
    })
  return { onBeforeRouteHook, filesystemRoots }
}

function findPageRouteFile(pageId: string, pageFilesAll: PageFile[]) {
  return pageFilesAll.find((p) => p.pageId === pageId && p.fileType === '.page.route')
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
