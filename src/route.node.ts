import { getUserFiles } from './user-files/getUserFiles.shared'
// @ts-ignore
import pathToRegexp from '@brillout/path-to-regexp'
import {
  assert,
  assertUsage,
  cast,
  isCallable,
  higherFirst,
  slice,
  assertWarning
} from './utils'
import { getGlobal } from './global.node'

export { route }
export { getErrorPageId }

type PageId = string
type RouteResult = {
  matchValue: boolean | number
  routeProps: Record<string, string>
}

async function route(
  url: string
): Promise<null | { pageId: PageId; routeProps: Record<string, string> }> {
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
        return { pageId, matchValue: -Infinity, routeProps: {} }
      } else {
        assertUsage(
          !isReservedPageId(pageId),
          'Only `_default.page.*`, `_404.page.js`, and `_500.page.js` are allowed to include the special character `_` in their file path.'
        )
      }

      // Route with filesystem
      if (!(pageId in pageRoutes)) {
        const matchValue = routeWith_filesystem(url, pageId, allPageIds)
        return { pageId, matchValue, routeProps: {} }
      }
      const pageRoute = pageRoutes[pageId]

      // Route with `.page.route.js` defined route string
      if (typeof pageRoute === 'string') {
        const routeString: string = pageRoute
        const { matchValue, routeProps } = routeWith_pathToRegexp(
          url,
          routeString
        )
        return { pageId, matchValue, routeProps }
      }

      // Route with `.page.route.js` defined route function
      if (isCallable(pageRoute)) {
        const routeFunction = pageRoute
        const { matchValue, routeProps } = routeFunction(url)
        return { pageId, matchValue, routeProps }
      }

      assert(false)
    })

  const winner = pickWinner(routeResults)

  if (is404Page(winner.pageId)) {
    userHintNoPageFound(url, allPageIds)
  }
  // console.log('[Route Match]:', `[${url}]: ${winner && winner.pageId}`)

  if (!winner) return null

  const { pageId, routeProps } = winner
  return { pageId, routeProps }
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

function pickWinner(
  routeResults: (RouteResult & { pageId: PageId })[]
): RouteResult & { pageId: PageId } {
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

function routeWith_pathToRegexp(url: string, routeString: string): RouteResult {
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

async function loadPageRoutes(): Promise<
  Record<PageId, string | ((url: string) => RouteResult)>
> {
  const userRouteFiles = await getUserFiles('.page.route')

  const pageRoutes = await Promise.all(
    userRouteFiles.map(async ({ filePath, loadFile }) => {
      const fileExports = await loadFile()
      assertUsage(
        typeof fileExports === 'object' && 'default' in fileExports,
        `${filePath} should have a default export.`
      )

      let pageRoute
      if (typeof fileExports.default === 'string') {
        pageRoute = fileExports.default
      } else if (isCallable(fileExports.default)) {
        pageRoute = (url: string) => {
          const result = fileExports.default(url)
          const { match, params } = result
          assertUsage(
            typeof match === 'boolean' || typeof match === 'number',
            `\`match\` returned by the \`route\` function in ${filePath} should be a boolean or a number.`
          )
          assertUsage(
            params?.constructor === Object,
            `\`params\` returned by the \`route\` function in ${filePath} should be an object.`
          )
          Object.entries(params).forEach(([key, val]) => {
            assertUsage(
              typeof val === 'string',
              `\`params.${key}\` returned by the \`route\` function in ${filePath} should be a string.`
            )
          })
          cast<Record<string, string>>(params)
          assertUsage(
            Object.keys(result).length === 2,
            `The \`route\` function in ${filePath} should be return an object \`{match, params}\`.`
          )
          return {
            matchValue: match,
            routeProps: params
          }
        }
      } else {
        assertUsage(
          false,
          `\`route\` defined in ${filePath} should be a string or a function.`
        )
      }

      const pageId = computePageId(filePath)

      return { pageId, pageRoute }
    })
  )

  const routeFiles = Object.fromEntries(
    pageRoutes.map(({ pageId, pageRoute }) => [pageId, pageRoute])
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
