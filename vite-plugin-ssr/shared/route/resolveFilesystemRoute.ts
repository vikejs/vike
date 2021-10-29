import { assert, higherFirst, slice } from '../utils'

export { resolveFilesystemRoute }
export { getFilesystemRoute }

function resolveFilesystemRoute(
  urlPathname: string,
  filesystemRoute: string
): { isMatch: boolean; routeParams: Record<string, string> } {
  urlPathname = removeTrailingSlash(urlPathname)
  // console.log('[Route Candidate] url:' + urlPathname, 'filesystemRoute:' + filesystemRoute)
  assert(urlPathname.startsWith('/'))
  assert(filesystemRoute.startsWith('/'))
  assert(!urlPathname.endsWith('/') || urlPathname === '/')
  assert(!filesystemRoute.endsWith('/') || filesystemRoute === '/')
  const isMatch = urlPathname === filesystemRoute
  return { isMatch, routeParams: {} }
}

function removeTrailingSlash(url: string) {
  if (url === '/' || !url.endsWith('/')) {
    return url
  } else {
    return slice(url, 0, -1)
  }
}

function getFilesystemRoute(pageId: string, filesystemRoots: { rootPath: string; rootValue: string }[]): string {
  // Handle Filesystem Routing Root
  const filesystemRootsMatch = filesystemRoots
    .filter(({ rootPath }) => pageId.startsWith(rootPath))
    .sort(higherFirst(({ rootPath }) => rootPath.length))
  const root = filesystemRootsMatch[0]
  let pageRoute = pageId
  if (root) {
    const { rootPath, rootValue } = root
    assert(pageRoute.startsWith(rootPath))
    pageRoute = slice(pageRoute, rootPath.length, 0)
    assert(pageRoute.startsWith('/'))
    pageRoute = rootValue + (rootValue.endsWith('/') ? '' : '/') + slice(pageRoute, 1, 0)
  }

  // Remove `pages/`, `index/, and `src/`, directories
  pageRoute = pageRoute.split('/pages/').join('/')
  pageRoute = pageRoute.split('/src/').join('/')
  pageRoute = pageRoute.split('/index/').join('/')

  // Hanlde `/index.page.*` suffix
  assert(!pageRoute.includes('.page.'))
  if (pageRoute.endsWith('/index')) {
    pageRoute = slice(pageRoute, 0, -'/index'.length)
  }

  if (pageRoute === '') {
    pageRoute = '/'
  }
  assert(pageRoute.startsWith('/'))

  return pageRoute
}
