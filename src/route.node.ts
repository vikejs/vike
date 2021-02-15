import { higherFirst } from './utils/sorter'
import {
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
type RouteResult = { matchValue: boolean | number; routeProps: RouteProps }
type PageId = string

async function route(
  url: string
): Promise<null | { pageId: PageId; routeProps: RouteProps }> {
  const pageRoutes = (await getPageRoutes())
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

async function getPageRoutes(): Promise<
  { pageId: string; routeFunction: (url: string) => RouteResult }[]
> {
  const pageServerFiles = await findUserFiles2('.server')

  const fileSystemRoute = await getFileSystemRoute()

  const pageRoutes = await Promise.all(
    Object.entries(pageServerFiles).map(async ([filePath, loadFile]) => {
      const fileExports = await loadFile()

      let routeFunction: (url: string) => RouteResult

      const pageId = computePageId(filePath)

      let pageRoute = fileExports.route
      assertUsage(
        !pageRoute || typeof pageRoute === 'string' || isCallable(pageRoute),
        `\`route\` defined in ${filePath} should be a string or a function.`
      )

      if (isCallable(pageRoute)) {
        routeFunction = (...args: any[]) => {
          const routeResult = pageRoute(...args)
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
                `The \`route\` function defined in ${filePath} should return a \`matchValue\` that is either a boolean or a number.`
              )
              return routeResult
            } else {
              return { matchValue: true, routeProps: routeResult }
            }
          }
        }
      } else if (typeof pageRoute === 'string') {
        routeFunction = (url: string) => {
          const match = pathToRegexp(url, { path: pageRoute, exact: true })
          // The longer the route string, the more likely is it specific
          const matchValue = pageRoute.length
          const routeProps = match.params
          return { matchValue, routeProps }
        }
      } else if (!pageRoute) {
        routeFunction = fileSystemRoute.bind(null, pageId)
      } else {
        assert(false)
      }

      return { pageId, routeFunction }
    })
  )

  return pageRoutes
}

async function getFileSystemRoute() {
  const pageIds = await getPageIds()

  return (pageId: string, url: string): RouteResult => {
    let pageRoute = removeCommonPrefix(pageId, pageIds)
    pageRoute = pageRoute
      .split('/')
      .filter((part) => part !== 'index')
      .join('/')
    pageRoute = normalize(pageRoute)

    url = normalize(url)
    // console.log("url:" + url, "pageRoute:" + pageRoute);

    const matchValue = url === pageRoute
    const routeProps = {}
    return { matchValue, routeProps }
  }

  function normalize(url: string): string {
    return url.split('/').filter(Boolean).join('/').toLowerCase()
  }
}
async function getPageIds(): Promise<PageId[]> {
  const files = await findUserFiles('.page')
  let filePaths = Object.keys(files)
  filePaths = filePaths.filter(
    (fileName) => !fileName.includes('/default.page.')
  )

  let pageIds = filePaths.map(computePageId)
  return pageIds
}

function removeCommonPrefix(pageId: PageId, pageIds: PageId[]) {
  const commonPrefix = getCommonPrefix(pageIds)
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

function computePageId(filePath: string): string {
  const pageSuffix = '.page.'
  const pageId = slice(filePath.split(pageSuffix), 0, -1).join(pageSuffix)
  return pageId
}
