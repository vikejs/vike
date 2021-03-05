import { getUserFiles } from './user-files/getUserFiles.shared'
// @ts-ignore
import pathToRegexp from '@brillout/path-to-regexp'
import {
  assert,
  assertUsage,
  isCallable,
  higherFirst,
  slice,
  assertWarning,
  hasProp
} from './utils'
import { getGlobal } from './global.node'

export { route }
export { getErrorPageId }

type PageId = string

async function route(
  url: string,
  contextProps: Record<string, unknown>
): Promise<null | {
  pageId: PageId
  contextPropsAddendum: Record<string, unknown>
}> {
  const allPageIds = await getPageIds()
  assertUsage(
    allPageIds.length > 0,
    'No *.page.js file found. You can create a `index.page.js` (or `index.page.jsx`, `index.page.vue`, ...) which will serve `/`.'
  )
  const pageRoutes = await loadPageRoutes()

  const routeResults = allPageIds
    .filter((pageId) => !is500Page(pageId))
    .map((pageId) => {
      // Route 404
      if (is404Page(pageId)) {
        return { pageId, matchValue: -Infinity, contextPropsAddendum: {} }
      } else {
        assertUsage(
          !isReservedPageId(pageId),
          'Only `_default.page.*`, `_404.page.js`, and `_500.page.js` are allowed to include the special character `_` in their file path.'
        )
      }

      // Route with filesystem
      if (!(pageId in pageRoutes)) {
        const matchValue = routeWith_filesystem(url, pageId, allPageIds)
        return { pageId, matchValue, contextPropsAddendum: {} }
      }
      const { pageRoute, pageRouteFile } = pageRoutes[pageId]

      // Route with `.page.route.js` defined route string
      if (typeof pageRoute === 'string') {
        const { matchValue, contextPropsAddendum } = resolveRouteString(
          pageRoute,
          url
        )
        return { pageId, matchValue, contextPropsAddendum }
      }

      // Route with `.page.route.js` defined route function
      if (isCallable(pageRoute)) {
        const { matchValue, contextPropsAddendum } = resolveRouteFunction(
          pageRoute,
          url,
          contextProps,
          pageRouteFile
        )
        return { pageId, matchValue, contextPropsAddendum }
      }

      assert(false)
    })

  const winner = pickWinner(routeResults)

  if (is404Page(winner.pageId)) {
    userHintNoPageFound(url, allPageIds)
  }
  // console.log('[Route Match]:', `[${url}]: ${winner && winner.pageId}`)

  if (!winner) return null

  const { pageId, contextPropsAddendum } = winner
  return { pageId, contextPropsAddendum }
}

function userHintNoPageFound(url: string, allPageIds: string[]) {
  const { isProduction } = getGlobal()
  if (!isProduction) {
    assertWarning(
      false,
      `No page is matching URL \`${url}\`. Defined pages: ${allPageIds
        .map((pageId) => `${pageId}.page.*`)
        .join(' ')} (this warning message is not shown in production.)`
    )
  }
}

async function getErrorPageId(): Promise<string | null> {
  const allPageIds = await getPageIds()
  const pages_500 = allPageIds.filter((pageId) => is500Page(pageId))
  assertUsage(
    pages_500.length <= 1,
    `Only one \`_500.page.js\` is allowed. Found several: ${pages_500.join(
      ' '
    )}`
  )
  if (pages_500.length > 0) {
    return pages_500[0]
  }
  const pages_404 = allPageIds.filter((pageId) => is404Page(pageId))
  assertUsage(
    pages_404.length <= 1,
    `Only one \`_404.page.js\` is allowed. Found several: ${pages_404.join(
      ' '
    )}`
  )
  if (pages_404.length > 0) {
    return pages_404[0]
  }
  return null
}

function pickWinner<T extends { matchValue: boolean | number }>(
  routeResults: T[]
): T {
  const candidates = routeResults
    .filter(({ matchValue }) => matchValue !== false)
    .sort(
      higherFirst(({ matchValue }) => {
        assert(matchValue !== false)
        return matchValue === true ? 0 : matchValue
      })
    )

  const winner = candidates[0]

  return winner
}

function routeWith_pathToRegexp(
  url: string,
  routeString: string
): { matchValue: false | number; routeProps: Record<string, string> } {
  const match = pathToRegexp(url, { path: routeString, exact: true })
  if (!match) {
    return { matchValue: false, routeProps: {} }
  }
  // The longer the route string, the more likely is it specific
  const matchValue = routeString.length
  const routeProps = match.params
  return { matchValue, routeProps }
}

function routeWith_filesystem(
  url: string,
  pageId: string,
  allPageIds: PageId[]
): boolean {
  let pageRoute = removeCommonPrefix(pageId, allPageIds)
  pageRoute = pageRoute
    .split('/')
    .filter((part) => part !== 'index')
    .join('/')
  pageRoute = normalize(pageRoute)

  url = normalize(url)
  // console.log('[Route Candidate] url:' + url, 'pageRoute:' + pageRoute)

  const matchValue = url === pageRoute
  return matchValue

  function normalize(url: string): string {
    return url.split('/').filter(Boolean).join('/').toLowerCase()
  }
}
function removeCommonPrefix(pageId: PageId, allPageIds: PageId[]) {
  const commonPrefix = getCommonPrefix(allPageIds)
  assert(pageId.startsWith(commonPrefix))
  return pageId.slice(commonPrefix.length)
}
function getCommonPrefix(strings: string[]): string {
  const list = strings.concat().sort()
  const first = list[0]
  const last = list[list.length - 1]
  let idx = 0
  for (; idx < first.length; idx++) {
    if (first[idx] !== last[idx]) break
  }
  return first.slice(0, idx)
}

async function getPageIds(): Promise<PageId[]> {
  const pageFiles = await getUserFiles('.page')
  let pageFilePaths = pageFiles.map(({ filePath }) => filePath)
  pageFilePaths = pageFilePaths.filter(
    (filePath) => !isDefaultPageFile(filePath)
  )

  let allPageIds = pageFilePaths.map(computePageId)
  return allPageIds
}
function computePageId(filePath: string): string {
  const pageSuffix = '.page.'
  const pageId = slice(filePath.split(pageSuffix), 0, -1).join(pageSuffix)
  return pageId
}

function isDefaultPageFile(filePath: string): boolean {
  assert(!filePath.includes('\\'))
  if (!filePath.includes('/_default')) {
    return false
  }
  assertUsage(
    filePath.includes('_default.page.client.') ||
      filePath.includes('_default.page.server.'),
    `\`_default.*\` file should be either \`_default.page.client.*\` or \`_default.page.server.*\` but we got: ${filePath}`
  )
  return true
}

function resolveRouteString(routeString: string, url: string) {
  const { matchValue, routeProps } = routeWith_pathToRegexp(url, routeString)
  const contextPropsAddendum = routeProps
  return { matchValue, contextPropsAddendum }
}
function resolveRouteFunction(
  routeFunction: Function,
  url: string,
  contextProps: Record<string, unknown>,
  routeFilePath: string
): {
  matchValue: boolean | number
  contextPropsAddendum: Record<string, unknown>
} {
  const result = routeFunction({ url, contextProps })
  assertUsage(
    typeof result === 'object' &&
      result !== null &&
      result.constructor === Object,
    `The Route Function ${routeFilePath} should return a plain JavaScript object, e.g. \`{ match: true }\`.`
  )
  assertUsage(
    hasProp(result, 'match'),
    `The Route Function ${routeFilePath} should return a \`{ match }\` value.`
  )
  assertUsage(
    typeof result.match === 'boolean' || typeof result.match === 'number',
    `The \`match\` value returned by the Route Function ${routeFilePath} should be a boolean or a number.`
  )
  let contextPropsAddendum = {}
  if (hasProp(result, 'contextProps')) {
    assertUsage(
      typeof result.contextProps === 'object' &&
        result.contextProps !== null &&
        result.contextProps.constructor === Object,
      `The \`contextProps\` returned by the Route function ${routeFilePath} should be a plain JavaScript object.`
    )
    contextPropsAddendum = result.contextProps
  }
  Object.keys(result).forEach((key) => {
    assertUsage(
      key === 'match' || key === 'contextProps',
      `The Route Function ${routeFilePath} returned an object with an unknown key \`{ ${key} }\`. Allowed keys: ['match', 'contextProps'].`
    )
  })
  return {
    matchValue: result.match,
    contextPropsAddendum
  }
}

async function loadPageRoutes(): Promise<
  Record<
    PageId,
    {
      pageRouteFile: string
      pageRoute: string | Function
    }
  >
> {
  const userRouteFiles = await getUserFiles('.page.route')

  const pageRoutes = await Promise.all(
    userRouteFiles.map(async ({ filePath, loadFile }) => {
      const fileExports = await loadFile()
      assertUsage(
        hasProp(fileExports, 'default'),
        `${filePath} should have a default export.`
      )
      assertUsage(
        typeof fileExports.default === 'string' ||
          isCallable(fileExports.default),
        `The default export of ${filePath} should be a string or a function.`
      )
      const pageRoute = fileExports.default
      const pageId = computePageId(filePath)
      const pageRouteFile = filePath
      return { pageId, pageRoute, pageRouteFile }
    })
  )

  const routeFiles = Object.fromEntries(
    pageRoutes.map(({ pageId, pageRoute, pageRouteFile }) => [
      pageId,
      { pageRoute, pageRouteFile }
    ])
  )

  return routeFiles
}

function isReservedPageId(pageId: string): boolean {
  assert(!pageId.includes('\\'))
  return pageId.includes('/_')
}
function is404Page(pageId: string): boolean {
  assert(!pageId.includes('\\'))
  return pageId.includes('/_404')
}
function is500Page(pageId: string): boolean {
  assert(!pageId.includes('\\'))
  return pageId.includes('/_500')
}
