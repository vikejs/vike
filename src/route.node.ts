import { higherFirst } from './utils/sorter'
import {
  findFile,
  findUserFiles,
  findUserFiles2
} from './user-files/findUserFiles.shared'
import { assert, assertUsage } from './utils/assert'
import { isCallable } from './utils/isCallable'
import { slice } from './utils/slice'
// @ts-ignore
import pathToRegexp from '@brillout/path-to-regexp'

export { route }

type RouteProps = Record<string, string>
type RouteResult = { matchValue: boolean | number; routeProps?: RouteProps }
type PageId = string

async function route(
  url: string
): Promise<null | { pageId: PageId; routeProps?: RouteProps }> {
  const allPageIds = await getPageIds()

  const pageRoutes = (await getPageRoutes(allPageIds))
    .map(({ pageId, routeFunction }) => {
      const { matchValue, routeProps } = routeFunction(url)
      return { pageId, matchValue, routeProps }
    })
    .filter(({ matchValue }) => matchValue !== false)
    .sort(
      higherFirst(({ matchValue }) => {
        assert(matchValue !== false)
        return matchValue === true ? 0 : matchValue
      })
    )

  const winner = pageRoutes[0]

  console.log('Match:', `[${url}]: ${winner && winner.pageId}`)

  if (!winner) {
    return null
  }
  const { pageId, routeProps } = winner
  return { pageId, routeProps }
}

async function getPageRoutes(
  allPageIds: PageId[]
): Promise<{ pageId: string; routeFunction: (url: string) => RouteResult }[]> {
  const pageRouteFiles = await findUserFiles2('.route')

  const fileSystemRoute = await getFileSystemRoute(allPageIds)

  const pageRoutes = await Promise.all(
    allPageIds.map(async (pageId) => {
      const pageRouteFile = findFile(pageRouteFiles, { pageId })

      let routeFunction: (url: string) => RouteResult

      if (!pageRouteFile) {
        routeFunction = fileSystemRoute.bind(null, pageId)
      } else {
        const { filePath, fileGetter } = pageRouteFile

        const fileExports = await fileGetter()
        assertUsage(
          fileExports && 'default' in fileExports,
          `${filePath} should have a default export.`
        )

        const pageRoute = fileExports.default
        assertUsage(
          typeof pageRoute === 'string' || isCallable(pageRoute),
          `\`route\` defined in ${filePath} should be a string or a function.`
        )

        if (typeof pageRoute === 'string') {
          routeFunction = (url: string): RouteResult => {
            const match = pathToRegexp(url, { path: pageRoute, exact: true })
            if (!match) {
              return { matchValue: false }
            }
            // The longer the route string, the more likely is it specific
            const matchValue = pageRoute.length
            const routeProps = match.params
            return { matchValue, routeProps }
          }
        } else if (isCallable(pageRoute)) {
          routeFunction = (url: string): RouteResult => {
            const routeResult = pageRoute(url)
            if (!routeResult) {
              return { matchValue: false }
            } else {
              const keys = Object.keys(routeResult)
              if (
                keys.length === 2 &&
                keys.includes('matchValue') &&
                keys.includes('routeProps')
              ) {
                assertUsage(
                  typeof routeResult.matchValue === 'boolean' ||
                    typeof routeResult.matchValue === 'number',
                  `The \`matchValue\` returned by the \`route\` function in ${filePath} should be a boolean or a number.`
                )
                return routeResult
              } else {
                return { matchValue: true, routeProps: routeResult }
              }
            }
          }
        } else {
          assert(false)
        }
      }

      return { pageId, routeFunction }
    })
  )

  return pageRoutes
}

async function getFileSystemRoute(allPageIds: PageId[]) {
  return (pageId: string, url: string): RouteResult => {
    let pageRoute = removeCommonPrefix(pageId, allPageIds)
    pageRoute = pageRoute
      .split('/')
      .filter((part) => part !== 'index')
      .join('/')
    pageRoute = normalize(pageRoute)

    url = normalize(url)
    // console.log("url:" + url, "pageRoute:" + pageRoute);

    const matchValue = url === pageRoute
    return { matchValue }
  }

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
  const files = await findUserFiles('.page')
  let filePaths = Object.keys(files)
  filePaths = filePaths.filter(
    (fileName) => !fileName.includes('/default.page.')
  )

  let allPageIds = filePaths.map(computePageId)
  return allPageIds
}
function computePageId(filePath: string): string {
  const pageSuffix = '.page.'
  const pageId = slice(filePath.split(pageSuffix), 0, -1).join(pageSuffix)
  return pageId
}
