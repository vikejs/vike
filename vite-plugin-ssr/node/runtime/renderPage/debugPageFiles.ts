export { debugPageFiles }
export type { PageContextDebug }

import { RouteMatches } from '../../../shared/route/index.js'
import type { ClientDependency } from '../../../shared/getPageFiles/analyzePageClientSide/ClientDependency.js'
import type { PageFile } from '../../../shared/getPageFiles.js'
import pc from '@brillout/picocolors'
import { assert, makeFirst, createDebugger } from '../utils.js'
import type { PageConfig } from '../../../shared/page-configs/PageConfig.js'

type PageContextDebug = {
  _routeMatches: 'ROUTE_ERROR' | RouteMatches
}
function debugPageFiles({
  pageContext,
  isHtmlOnly,
  isClientRouting,
  pageFilesLoaded,
  pageFilesServerSide,
  pageFilesClientSide,
  clientEntries,
  clientDependencies
}: {
  pageContext: {
    urlOriginal: string
    _pageId: string
    _pageFilesAll: PageFile[]
    _pageConfigs: PageConfig[]
  } & PageContextDebug
  isHtmlOnly: boolean
  isClientRouting: boolean
  pageFilesLoaded: PageFile[]
  pageFilesClientSide: PageFile[]
  pageFilesServerSide: PageFile[]
  clientEntries: string[]
  clientDependencies: ClientDependency[]
}): void {
  const debug = createDebugger('vps:pageFiles', { serialization: { emptyArray: 'None' } })
  const padding = '   - '

  debug('All page files:', printPageFiles(pageContext._pageFilesAll, true)) // TODO
  debug(`URL:`, pageContext.urlOriginal)
  debug.options({ serialization: { emptyArray: 'No match' } })(`Routing:`, printRouteMatches(pageContext._routeMatches))
  debug(`pageId:`, pageContext._pageId)
  debug('Page type:', isHtmlOnly ? 'HTML-only' : 'SSR/SPA')
  debug(`Routing type:`, !isHtmlOnly && isClientRouting ? 'Client Routing' : 'Server Routing')
  debug('Server-side page files:', printPageFiles(pageFilesLoaded))
  assert(samePageFiles(pageFilesLoaded, pageFilesServerSide))
  debug('Client-side page files:', printPageFiles(pageFilesClientSide))
  debug('Client-side entries:', clientEntries)
  debug('Client-side dependencies:', clientDependencies)

  return

  function printRouteMatches(routeMatches: PageContextDebug['_routeMatches']) {
    if (routeMatches === 'ROUTE_ERROR') {
      return 'Routing Failed'
    }
    if (routeMatches === 'CUSTOM_ROUTE') {
      return 'Custom Routing'
    }
    return routeMatches
  }

  function printPageFiles(pageFiles: PageFile[], genericPageFilesLast = false): string {
    if (pageFiles.length === 0) {
      return 'None'
    }
    return (
      '\n' +
      pageFiles
        .sort((p1, p2) => p1.filePath.localeCompare(p2.filePath))
        .sort(makeFirst((p) => (p.isRendererPageFile ? !genericPageFilesLast : null)))
        .sort(makeFirst((p) => (p.isDefaultPageFile ? !genericPageFilesLast : null)))
        .map((p) => p.filePath)
        .map((s) => s.split('_default.page.').join(`${pc.blue('_default')}.page.`))
        .map((s) => s.split('/renderer/').join(`/${pc.red('renderer')}/`))
        .map((s) => padding + s)
        .join('\n')
    )
  }
}

function samePageFiles(pageFiles1: PageFile[], pageFiles2: PageFile[]) {
  return (
    pageFiles1.every((p1) => pageFiles2.some((p2) => p2.filePath === p1.filePath)) &&
    pageFiles2.every((p2) => pageFiles1.some((p1) => p1.filePath === p2.filePath))
  )
}
