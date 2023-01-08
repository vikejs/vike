import type { PageFile } from '../getPageFiles'
import { isErrorPageId } from './error-page'
import { assert, assertUsage, hasProp, slice } from './utils'
import type { OnBeforeRouteHook } from './callOnBeforeRouteHook'
import { FilesystemRoot, deduceRouteStringFromFilesystemPath } from './deduceRouteStringFromFilesystemPath'
import type { PageConfig } from '../getPageFiles/getPageConfigsFromGlob'

export { loadPageRoutes }
export { findPageRouteFile }
export type { PageRoutes }
export type { RouteType }

type PageRoutes = ({ pageId: string } & (
  | { routeString: string; pageRouteFilePath: null; routeType: 'FILESYSTEM' }
  | { routeString: string; pageRouteFilePath: string; routeType: 'STRING' }
  | { routeFunction: Function; pageRouteFilePath: string; allowAsync: boolean; routeType: 'FUNCTION' }
))[]
type RouteType = 'STRING' | 'FUNCTION' | 'FILESYSTEM'

async function loadPageRoutes(
  pageFilesAll: PageFile[],
  pageConfigs: PageConfig[],
  allPageIds: string[]
): Promise<{ pageRoutes: PageRoutes; onBeforeRouteHook: null | OnBeforeRouteHook }> {
  await Promise.all(pageFilesAll.filter((p) => p.fileType === '.page.route').map((p) => p.loadFile?.()))
  const { onBeforeRouteHook, filesystemRoots } = getGlobalHooks(pageFilesAll)
  const pageRoutes = getPageRoutes(filesystemRoots, pageFilesAll, allPageIds)
  return { pageRoutes, onBeforeRouteHook }
}

function getPageRoutes(filesystemRoots: FilesystemRoot[], pageFilesAll: PageFile[], allPageIds: string[]): PageRoutes {
  const pageRoutes: PageRoutes = []
  allPageIds
    .filter((pageId) => !isErrorPageId(pageId))
    .forEach((pageId) => {
      const pageRouteFile = findPageRouteFile(pageId, pageFilesAll)
      if (!pageRouteFile) {
        const routeString = deduceRouteStringFromFilesystemPath(pageId, filesystemRoots)
        assert(routeString.startsWith('/'))
        assert(!routeString.endsWith('/') || routeString === '/')
        pageRoutes.push({
          pageId,
          routeString,
          pageRouteFilePath: null,
          routeType: 'FILESYSTEM'
        })
      } else {
        const { filePath, fileExports } = pageRouteFile
        assert(fileExports)
        assertUsage('default' in fileExports, `${filePath} should have a default export.`)
        if (hasProp(fileExports, 'default', 'string')) {
          const routeString = fileExports.default
          assertUsage(
            routeString.startsWith('/'),
            `A Route String should start with a leading \`/\` but \`${filePath}\` has \`export default '${routeString}'\`. Make sure to \`export default '/${routeString}'\` instead.`
          )
          pageRoutes.push({
            pageId,
            routeString,
            pageRouteFilePath: filePath,
            routeType: 'STRING'
          })
          return
        }
        if (hasProp(fileExports, 'default', 'function')) {
          const routeFunction = fileExports.default
          let allowAsync = false
          const allowKey = 'iKnowThePerformanceRisksOfAsyncRouteFunctions'
          if (allowKey in fileExports) {
            assertUsage(
              hasProp(fileExports, allowKey, 'boolean'),
              `The export \`${allowKey}\` of ${filePath} should be a boolean.`
            )
            allowAsync = fileExports[allowKey]
          }
          pageRoutes.push({
            pageId,
            routeFunction,
            pageRouteFilePath: filePath,
            allowAsync,
            routeType: 'FUNCTION'
          })
          return
        }
        assertUsage(false, `The default export of ${filePath} should be a string or a function.`)
      }
    })
  return pageRoutes
}

function getGlobalHooks(pageFilesAll: PageFile[]): {
  onBeforeRouteHook: null | OnBeforeRouteHook
  filesystemRoots: FilesystemRoot[]
} {
  let onBeforeRouteHook: null | OnBeforeRouteHook = null
  const filesystemRoots: FilesystemRoot[] = []
  pageFilesAll
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
