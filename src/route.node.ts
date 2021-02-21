import { getUserFiles } from './user-files/getUserFiles.shared'
// @ts-ignore
import pathToRegexp from '@brillout/path-to-regexp'
import {
  assert,
  assertUsage,
  cast,
  isCallable,
  higherFirst,
  slice
} from './utils'

export { route }

type PageId = string
type RouteResult = {
  matchValue: boolean | number
  routeProps: Record<string, string>
}

async function route(
  url: string
): Promise<null | { pageId: PageId; routeProps: Record<string, string> }> {
  const allPageIds = await getPageIds()
  const pageRoutes = await loadPageRoutes()

  const routeResults = allPageIds.map((pageId) => {
    // Route 404
    if (is404Page(pageId)) {
      return { pageId, matchValue: -Infinity, routeProps: {} }
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

  // console.log('[Route Match]:', `[${url}]: ${winner && winner.pageId}`)

  if (!winner) return null

  const { pageId, routeProps } = winner
  return { pageId, routeProps }
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
  pageFilePaths = pageFilePaths.filter((filePath) => {
    assert(!filePath.includes('\\'))
    return !filePath.includes('/_default')
  })

  let allPageIds = pageFilePaths.map(computePageId)
  return allPageIds
}
function computePageId(filePath: string): string {
  const pageSuffix = '.page.'
  const pageId = slice(filePath.split(pageSuffix), 0, -1).join(pageSuffix)
  return pageId
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

function is404Page(pageId: string): boolean {
  assert(!pageId.includes('\\'))
  return pageId.includes('/_404')
}
