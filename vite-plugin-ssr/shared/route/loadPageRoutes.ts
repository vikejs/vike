import type { PageFile } from '../getPageFiles'
import { isErrorPageId } from '../error-page'
import { assert, assertUsage, hasProp, slice } from './utils'
import type { OnBeforeRouteHook } from './callOnBeforeRouteHook'
import { FilesystemRoot, deduceRouteStringFromFilesystemPath } from './deduceRouteStringFromFilesystemPath'
import { isCallable } from '../utils'
import type { PlusConfig, PlusConfigGlobal } from '../page-configs/PlusConfig'

export { loadPageRoutes }
export { findPageRouteFile }
export type { PageRoutes }
export type { RouteType }

type PageRoute = {
  pageId: string
  comesFromV1PlusConfig: boolean
} & (
  | { routeString: string; routeDefinedAt: null; routeType: 'FILESYSTEM'; routeFilesystemDefinedBy: string }
  | { routeString: string; routeDefinedAt: string; routeType: 'STRING' }
  | { routeFunction: Function; routeDefinedAt: string; allowAsync: boolean; routeType: 'FUNCTION' }
)
type PageRoutes = PageRoute[]
type RouteType = 'STRING' | 'FUNCTION' | 'FILESYSTEM'

async function loadPageRoutes(
  // TODO: remove all arguments and use GlobalContext instead
  pageFilesAll: PageFile[],
  plusConfigs: PlusConfig[],
  plusConfigGlobal: PlusConfigGlobal,
  allPageIds: string[]
): Promise<{ pageRoutes: PageRoutes; onBeforeRouteHook: null | OnBeforeRouteHook }> {
  await Promise.all(pageFilesAll.filter((p) => p.fileType === '.page.route').map((p) => p.loadFile?.()))
  const { onBeforeRouteHook, filesystemRoots } = getGlobalHooks(pageFilesAll, plusConfigs, plusConfigGlobal)
  const pageRoutes = getPageRoutes(filesystemRoots, pageFilesAll, plusConfigs, allPageIds)
  return { pageRoutes, onBeforeRouteHook }
}

function getPageRoutes(
  filesystemRoots: FilesystemRoot[],
  pageFilesAll: PageFile[],
  plusConfigs: PlusConfig[],
  allPageIds: string[]
): PageRoutes {
  const pageRoutes: PageRoutes = []

  let pageIds = [...allPageIds]

  // V1 Design
  if (plusConfigs.length > 0) {
    const comesFromV1PlusConfig = true
    plusConfigs
      .filter((p) => !p.isErrorPage)
      .forEach((plusConfig) => {
        const pageId = plusConfig.pageId
        pageIds = removePageId(pageIds, pageId)

        let pageRoute: null | PageRoute = null
        {
          const routeConfig = plusConfig.configElements.route
          if (routeConfig) {
            assert('configValue' in routeConfig) // Route files are eagerly loaded
            const route = routeConfig.configValue
            const routeDefinedAt = routeConfig.configDefinedAt
            assert(routeDefinedAt)
            if (typeof route === 'string') {
              pageRoute = { pageId, comesFromV1PlusConfig, routeString: route, routeDefinedAt, routeType: 'STRING' }
            } else {
              assert(isCallable(route))
              let allowAsync = false
              const allowSyncConfig = plusConfig.configElements.iKnowThePerformanceRisksOfAsyncRouteFunctions
              if (allowSyncConfig) {
                assert(!('codeFilePath' in allowSyncConfig)) // TODO: improve this?
                const val = allowSyncConfig.configValue
                assert(typeof val === 'boolean') // TODO: assertUsage()
                allowAsync = val
              }
              pageRoute = {
                pageId,
                comesFromV1PlusConfig,
                routeFunction: route,
                routeDefinedAt,
                routeType: 'FUNCTION',
                allowAsync
              }
            }
          }
        }

        if (!pageRoute) {
          const { routeFilesystem, routeFilesystemDefinedBy } = plusConfig
          assert(routeFilesystem)
          assert(routeFilesystem.startsWith('/'))
          assert(routeFilesystemDefinedBy)
          pageRoute = {
            pageId,
            routeFilesystemDefinedBy,
            comesFromV1PlusConfig,
            routeString: routeFilesystem,
            routeDefinedAt: null,
            routeType: 'FILESYSTEM'
          }
        }

        assert(pageRoute)
        pageRoutes.push(pageRoute)
      })
  }

  // Old design
  // TODO/v1-release: remove
  if (plusConfigs.length === 0) {
    const comesFromV1PlusConfig = false
    pageIds
      .filter((pageId) => !isErrorPageId(pageId, false))
      .forEach((pageId) => {
        const pageRouteFile = findPageRouteFile(pageId, pageFilesAll)
        if (!pageRouteFile) {
          const routeString = deduceRouteStringFromFilesystemPath(pageId, filesystemRoots)
          assert(routeString.startsWith('/'))
          assert(!routeString.endsWith('/') || routeString === '/')
          pageRoutes.push({
            pageId,
            comesFromV1PlusConfig,
            routeString,
            routeDefinedAt: null,
            routeFilesystemDefinedBy: `${pageId}.page.*`,
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
              comesFromV1PlusConfig,
              routeString,
              routeDefinedAt: filePath,
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
              comesFromV1PlusConfig,
              routeFunction,
              routeDefinedAt: filePath,
              allowAsync,
              routeType: 'FUNCTION'
            })
            return
          }
          assertUsage(false, `The default export of ${filePath} should be a string or a function.`)
        }
      })
  }

  return pageRoutes
}

function getGlobalHooks(
  pageFilesAll: PageFile[],
  plusConfigs: PlusConfig[],
  plusConfigGlobal: PlusConfigGlobal
): {
  onBeforeRouteHook: null | OnBeforeRouteHook
  filesystemRoots: FilesystemRoot[]
} {
  // V1 Design
  if (plusConfigs.length > 0) {
    if (plusConfigGlobal.onBeforeRoute) {
      const hookFn = plusConfigGlobal.onBeforeRoute.configValue
      if (hookFn) {
        const hookFilePath = plusConfigGlobal.onBeforeRoute.plusValueFilePath
        assert(hookFilePath)
        assertUsage(isCallable(hookFn), `The hook onBeforeRoute() defined by ${hookFilePath} should be a function.`)
        const onBeforeRouteHook: OnBeforeRouteHook = {
          hookSrc: hookFilePath,
          onBeforeRoute: hookFn
        }
        return { onBeforeRouteHook, filesystemRoots: [] }
      }
    }
    return { onBeforeRouteHook: null, filesystemRoots: [] }
  }

  // Old design
  // TODO/v1-release: remove
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
        onBeforeRouteHook = { hookSrc: `${filePath} > \`export { onBeforeRoute }\``, onBeforeRoute }
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
          urlRoot: fileExports.filesystemRoutingRoot
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

function removePageId(pageIds: string[], pageId: string): string[] {
  const { length } = pageIds
  pageIds = pageIds.filter((id) => id !== pageId)
  assert(pageIds.length === length - 1)
  return pageIds
}
