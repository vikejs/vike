export { log404 }

// Exported for ./index.spec.ts
export { getRoutesInfo }

import type { PageRoutes } from '../../../../shared/route/index.js'
import { noRouteMatch } from '../../../../shared/route/noRouteMatch.js'
import type { GlobalContextServerInternal } from '../../globalContext.js'
import {
  assert,
  assertUsage,
  assertInfo,
  compareString,
  stripAnsi,
  getTerminalWidth,
  truncateString,
} from '../../utils.js'
import pc from '@brillout/picocolors'

async function log404(pageContext: {
  urlPathname: string
  errorWhileRendering: null | Error
  isClientSideNavigation: boolean
  _globalContext: GlobalContextServerInternal
}) {
  const { urlPathname } = pageContext

  const pageRoutes = pageContext._globalContext._pageRoutes
  assertUsage(
    pageRoutes.length > 0,
    'No page found.',
    /* TO-DO/next-major-release: use this
    'No page found. Create at least one /pages/some-page/+Page.js file.'
    */
  )
  const globalContext = pageContext._globalContext
  if (!globalContext._isProduction && !isFileRequest(urlPathname) && !pageContext.isClientSideNavigation) {
    const routesInfo = getRoutesInfo(pageRoutes)
    let msg = `URL ${pc.cyan(urlPathname)} ${noRouteMatch}`
    const outro = 'See https://vike.dev/routing for more information about routing.'
    if (!routesInfo) {
      msg = `${msg}. ${pc.dim(outro)}`
    } else {
      msg = `${msg}:\n${routesInfo}\n${outro}`
    }
    assertInfo(false, msg, { onlyOnce: false })
  }
}
function getRoutesInfo(pageRoutes: PageRoutes): string | null {
  const entries = pageRoutes
    .map((pageRoute) => {
      let routeStr: string
      let routeTypeSrc: 'Route String' | 'Route Function' | 'Filesystem Route'
      let routeDefinedBy: string
      if (pageRoute.routeType === 'FILESYSTEM') {
        assert(pageRoute.routeFilesystemDefinedBy)
        routeDefinedBy = pageRoute.routeFilesystemDefinedBy
      } else {
        assert(pageRoute.routeDefinedAtString)
        routeDefinedBy = pageRoute.routeDefinedAtString
      }
      if (pageRoute.routeType === 'STRING') {
        routeStr = pageRoute.routeString
        routeTypeSrc = 'Route String'
      } else if (pageRoute.routeType === 'FUNCTION') {
        routeStr = String(pageRoute.routeFunction)
        routeTypeSrc = 'Route Function'
      } else {
        routeStr = pageRoute.routeString
        routeTypeSrc = 'Filesystem Route'
      }
      assert(routeStr && routeTypeSrc && routeDefinedBy)
      return { routeStr, routeTypeSrc, routeDefinedBy }
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

  const linesContent = [
    {
      routeStr: 'ROUTE',
      routeTypeSrc: 'TYPE' as const,
      routeDefinedBy: 'DEFINED BY',
    },
    ...entries,
  ]

  const terminalWidth = getTerminalWidth() || 134

  let width2 = Math.max(...linesContent.map(({ routeTypeSrc }) => stripAnsi(routeTypeSrc).length))
  let width3 = Math.max(...linesContent.map(({ routeDefinedBy }) => stripAnsi(routeDefinedBy).length))

  const width1_max =
    terminalWidth -
    width3 -
    width2 -
    // Total width of table border & padding
    10
  if (width1_max < 10) return null
  linesContent.forEach((lineContent) => {
    let { routeStr } = lineContent
    if (lineContent.routeTypeSrc === 'Route Function') {
      routeStr = truncateRouteFunction(routeStr, width1_max)
      assert(stripAnsi(routeStr).length <= width1_max)
    }
    lineContent.routeStr = routeStr
  })
  let width1 = Math.max(...linesContent.map(({ routeStr }) => stripAnsi(routeStr).length))
  if (width1 > width1_max) return null

  let lines = linesContent.map(({ routeStr, routeTypeSrc, routeDefinedBy }, i) => {
    let cell1 = padEnd(routeStr, width1 + (stripAnsi(routeStr).length - stripAnsi(routeStr).length))
    let cell2 = padEnd(routeTypeSrc, width2)
    let cell3 = padEnd(routeDefinedBy, width3)
    const isHeader = i === 0
    if (isHeader) {
      cell1 = pc.dim(cell1)
      cell2 = pc.dim(cell2)
      cell3 = pc.dim(cell3)
    }
    let line = [cell1, cell2, cell3].join(pc.dim(' │ '))
    line = pc.dim('│ ') + line + pc.dim(' │')
    return line
  })

  width1 = width1 + 2
  width2 = width2 + 2
  width3 = width3 + 2

  // https://en.wikipedia.org/wiki/Box-drawing_character
  lines = [
    pc.dim(`┌${'─'.repeat(width1)}┬${'─'.repeat(width2)}┬${'─'.repeat(width3)}┐`),
    lines[0]!,
    pc.dim(`├${'─'.repeat(width1)}┼${'─'.repeat(width2)}┼${'─'.repeat(width3)}┤`),
    ...lines.slice(1),
    pc.dim(`└${'─'.repeat(width1)}┴${'─'.repeat(width2)}┴${'─'.repeat(width3)}┘`),
  ]

  lines.forEach((line) => {
    assert(stripAnsi(line).length <= terminalWidth)
  })

  return lines.join('\n')
}

function truncateRouteFunction(routeStr: string, lenMax: number) {
  routeStr = stripAnsi(routeStr)
  routeStr = removeNonAscii(routeStr)
  routeStr = routeStr.split(/\s/).filter(Boolean).join(' ')
  routeStr = truncateString(routeStr, lenMax)
  return routeStr
}

/** Same as String.prototype.padEnd but with stripAnsi() */
function padEnd(str: string, width: number): string {
  const padWidth = Math.max(0, width - stripAnsi(str).length)
  return str + ''.padEnd(padWidth, ' ')
}

function removeNonAscii(str: string) {
  // https://stackoverflow.com/questions/20856197/remove-non-ascii-character-in-string/20856346#20856346
  return str.replace(/[^\x00-\x7F]/g, '')
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
