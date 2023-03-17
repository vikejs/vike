export { log404 }

import { PageFile } from '../../../shared/getPageFiles'
import { PageRoutes, loadPageRoutes } from '../../../shared/route'
import { getGlobalContext } from '../globalContext'
import { assert, assertUsage, assertInfo, compareString } from '../utils'
import pc from 'picocolors'
import { isRenderErrorPageException } from '../../../shared/route/RenderErrorPage'
import type { PageConfig, PageConfigGlobal } from '../../../shared/page-configs/PageConfig'

async function log404(pageContext: {
  urlPathname: string
  errorWhileRendering: null | Error
  _isPageContextRequest: boolean
  _pageFilesAll: PageFile[]
  _pageConfigs: PageConfig[]
  _pageConfigGlobal: PageConfigGlobal
  _allPageIds: string[]
}) {
  const { urlPathname } = pageContext

  if (isRenderErrorPageException(pageContext.errorWhileRendering)) {
    assertInfo(
      false,
      `${pc.cyan('throw RenderErrorPage()')} was thrown while rendering URL ${pc.bold(
        urlPathname
      )} (this log isn't shown in production)`,
      { onlyOnce: false }
    )
    return
  }

  const { pageRoutes } = await loadPageRoutes(
    pageContext._pageFilesAll,
    pageContext._pageConfigs,
    pageContext._pageConfigGlobal,
    pageContext._allPageIds
  )
  assertUsage(
    pageRoutes.length > 0,
    'No page found. Create a file that ends with the suffix `.page.js` (or `.page.vue`, `.page.jsx`, ...).'
  )
  const globalContext = getGlobalContext()
  if (!globalContext.isProduction && !isFileRequest(urlPathname) && !pageContext._isPageContextRequest) {
    assertInfo(
      false,
      [
        `URL ${pc.bold(
          urlPathname
        )} isn't matching any of your page routes. See https://vite-plugin-ssr.com/routing for more information about routing. Set the environment variable ${pc.cyan(
          'DEBUG=vps:routing'
        )} to inspect your app's routing. (This log isn't shown in production.) Your page routes:`,
        getPagesAndRoutesInfo(pageRoutes)
      ].join('\n'),
      { onlyOnce: false }
    )
  }
}
function getPagesAndRoutesInfo(pageRoutes: PageRoutes): string {
  const entries = pageRoutes
    .map((pageRoute) => {
      let routeStr: string
      let routeTypeSrc: 'Route String' | 'Route Function' | 'Filesystem Route'
      let routeDefinedByStr: string
      if (pageRoute.routeType === 'FILESYSTEM') {
        assert(pageRoute.routeFilesystemDefinedBy)
        routeDefinedByStr = pageRoute.routeFilesystemDefinedBy
      } else {
        assert(pageRoute.pageRouteFilePath)
        routeDefinedByStr = pageRoute.pageRouteFilePath
      }
      if (pageRoute.routeType === 'STRING') {
        routeStr = pageRoute.routeString
        routeTypeSrc = 'Route String'
      } else if (pageRoute.routeType === 'FUNCTION') {
        routeStr = truncateString(String(pageRoute.routeFunction).split(/\s/).filter(Boolean).join(' '), 64)
        routeTypeSrc = 'Route Function'
      } else {
        routeStr = pageRoute.routeString
        routeTypeSrc = 'Filesystem Route'
      }
      assert(routeStr && routeTypeSrc && routeDefinedByStr)
      return { routeStr, routeTypeSrc, routeDefinedByStr }
    })
    .sort((e1, e2) => {
      if (e1.routeTypeSrc !== 'Route Function' && e2.routeTypeSrc === 'Route Function') {
        return -1
      }
      if (e1.routeTypeSrc === 'Route Function' && e2.routeTypeSrc !== 'Route Function') {
        return 1
      }
      return compareString(e1.routeStr, e2.routeStr)
    })

  const lines = [
    {
      routeStr: 'ROUTE',
      routeTypeSrc: 'ROUTE TYPE',
      routeDefinedByStr: 'DEFINED BY'
    },
    ...entries
  ]

  const column1Width = 2 + Math.max(...lines.map(({ routeStr }) => routeStr.length))
  const column2Width = 2 + Math.max(...lines.map(({ routeTypeSrc }) => routeTypeSrc.length))
  const column3Width = 2 + Math.max(...lines.map(({ routeDefinedByStr }) => routeDefinedByStr.length))

  return lines
    .map(({ routeStr, routeTypeSrc, routeDefinedByStr }, i) => {
      let cell1 = routeStr.padEnd(column1Width, ' ')
      if (i !== 0) cell1 = pc.bold(cell1)
      let cell2 = routeTypeSrc.padEnd(column2Width, ' ')
      let cell3 = routeDefinedByStr.padEnd(column3Width, ' ')
      if (i === 0) {
        cell1 = pc.gray(cell1)
        cell2 = pc.gray(cell2)
        cell3 = pc.gray(cell3)
      }
      const line = [cell1, cell2, cell3].join(' ')
      return line
    })
    .join('\n')
}

function truncateString(str: string, len: number) {
  if (len > str.length) {
    return str
  } else {
    str = str.substring(0, len)
    return str + '...'
  }
}

function isFileRequest(urlPathname: string) {
  assert(urlPathname.startsWith('/'))
  const paths = urlPathname.split('/')
  const lastPath = paths[paths.length - 1]
  assert(typeof lastPath === 'string')
  const parts = lastPath.split('.')
  if (parts.length < 2) {
    return false
  }
  const fileExtension = parts[parts.length - 1]
  assert(typeof fileExtension === 'string')
  return /^[a-z0-9]+$/.test(fileExtension)
}
