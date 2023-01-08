export { log404 }

import { PageFile } from '../../../shared/getPageFiles'
import { PageRoutes, loadPageRoutes } from '../../../shared/route'
import { getGlobalContext } from '../globalContext'
import { assert, assertUsage, assertInfo, compareString } from '../../utils'
import { isRenderErrorPageException } from './RenderErrorPage'
import type { PageConfig } from '../../../shared/getPageFiles/getPageConfigsFromGlob'

async function log404(pageContext: {
  urlPathname: string
  errorWhileRendering: null | Error
  _pageFilesAll: PageFile[]
  _pageConfigs: PageConfig[]
  _allPageIds: string[]
  _isPageContextRequest: boolean
}) {
  const { urlPathname } = pageContext

  if (isRenderErrorPageException(pageContext.errorWhileRendering)) {
    assertInfo(
      false,
      `\`throw RenderErrorPage()\` was thrown while rendering URL \`${urlPathname}\`. (This log isn't shown in production.)`,
      { onlyOnce: false }
    )
    return
  }

  const { pageRoutes } = await loadPageRoutes(
    pageContext._pageFilesAll,
    pageContext._pageConfigs,
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
        `URL \`${urlPathname}\` isn't matching any of your ${pageRoutes.length} page routes. See https://vite-plugin-ssr.com/routing and/or set the environment variable \`DEBUG=vps:routing\` for more information. (This info isn't shown in production.) Your page routes:`,
        ...getPagesAndRoutesInfo(pageRoutes)
      ].join('\n'),
      { onlyOnce: false }
    )
  }
}
function getPagesAndRoutesInfo(pageRoutes: PageRoutes) {
  return pageRoutes
    .map((pageRoute) => {
      let route_humanReadable: string
      let routeType_humanReadable: string
      if (pageRoute.routeType === 'STRING') {
        route_humanReadable = pageRoute.routeString
        routeType_humanReadable = 'Route String'
      } else if (pageRoute.routeType === 'FUNCTION') {
        route_humanReadable = truncateString(String(pageRoute.routeFunction).split(/\s/).filter(Boolean).join(' '), 64)
        routeType_humanReadable = 'Route Function'
      } else {
        route_humanReadable = pageRoute.routeString
        routeType_humanReadable = 'Filesystem Route'
      }
      return `\`${route_humanReadable}\` (${routeType_humanReadable} of \`${pageRoute.pageId}.page.*\`)`
    })
    .sort(compareString)
    .map((line, i) => {
      const nth = (i + 1).toString().padStart(pageRoutes.length.toString().length, '0')
      return ` (${nth}) ${line}`
    })
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
