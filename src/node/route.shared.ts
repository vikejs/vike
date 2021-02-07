import { higherFirst } from './utils/sorter'
import { PageId, Url } from './types'
import { findUserFiles } from './findUserFiles'
import { assert } from './utils/assert'

export { route }

type RouteValue = boolean | number

async function route(url: Url): Promise<PageId | null> {
  const pageIds = await getPageIds()

  const candidates = pageIds
    .map((pageId) => {
      const routeValue = filesystemRoute(url, pageId, pageIds)
      return { pageId, routeValue }
    })
    .filter(({ routeValue }) => routeValue !== false)
    .sort(
      higherFirst(({ routeValue }) => {
        assert(routeValue !== false)
        return routeValue === true ? 0 : routeValue
      })
    )

  const winner = candidates[0]

  console.log('Match:', `[${url}]: ${winner?.pageId}`)

  if (!winner) {
    return null
  }
  return winner.pageId
}

async function getPageIds(): Promise<PageId[]> {
  const files = await findUserFiles('.page')
  let fileNames = Object.keys(files)
  fileNames = fileNames.filter(
    (fileName) => !fileName.includes('/default.page.')
  )

  let pageIds = fileNames.map((fileName) => {
    const parts = fileName.split('.page.')
    const pageId = parts.slice(0, -1).join('')
    return pageId
  })
  return pageIds
}

function filesystemRoute(
  url: Url,
  pageId: PageId,
  pageIds: PageId[]
): RouteValue {
  let pageRoute = removeCommonPrefix(pageId, pageIds)
  pageRoute = pageRoute
    .split('/')
    .filter((part) => part !== 'index')
    .join('/')
  pageRoute = normalize(pageRoute)

  url = normalize(url)
  // console.log("url:" + url, "pageRoute:" + pageRoute);

  return url === pageRoute

  function normalize(url: string): string {
    return url.split('/').filter(Boolean).join('/').toLowerCase()
  }
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
