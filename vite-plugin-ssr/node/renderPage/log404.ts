export { log404 }

import { PageFile } from '../../shared/getPageFiles'
import { PageRoutes, loadPageRoutes } from '../../shared/route'
import { assert, assertUsage, assertInfo, compareString } from '../utils'
import { isRenderErrorPageException } from './RenderErrorPage'

async function log404(pageContext: {
  urlPathname: string
  errorWhileRendering: null | Error
  _pageFilesAll: PageFile[]
  _allPageIds: string[]
  _isPageContextRequest: boolean
  _isProduction: boolean
}) {
  const { urlPathname } = pageContext

  if (isRenderErrorPageException(pageContext.errorWhileRendering)) {
    assertInfo(
      false,
      `\`throw RenderErrorPage()\` was thrown while rendering URL \`${urlPathname}\`. (This info isn't shown in production.)`,
      { onlyOnce: false }
    )
    return
  }

  const { pageRoutes } = await loadPageRoutes(pageContext)
  assertUsage(
    pageRoutes.length > 0,
    'No page found. Create a file that ends with the suffix `.page.js` (or `.page.vue`, `.page.jsx`, ...).'
  )
  if (!pageContext._isProduction && !isFileRequest(urlPathname) && !pageContext._isPageContextRequest) {
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
      const { pageId, filesystemRoute, pageRouteFile } = pageRoute
      let route
      let routeType
      if (pageRouteFile) {
        const { routeValue } = pageRouteFile
        route =
          typeof routeValue === 'string'
            ? routeValue
            : truncateString(String(routeValue).split(/\s/).filter(Boolean).join(' '), 64)
        routeType = typeof routeValue === 'string' ? 'Route String' : 'Route Function'
      } else {
        route = filesystemRoute
        routeType = 'Filesystem Route'
      }
      return `\`${route}\` (${routeType} of \`${pageId}.page.*\`)`
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
