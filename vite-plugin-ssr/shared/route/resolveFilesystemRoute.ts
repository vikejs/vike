import { assert, higherFirst, slice } from '../utils'

export { resolveFilesystemRoute }
export { getFilesystemRoute }

function resolveFilesystemRoute(
  filesystemRoute: string,
  urlPathname: string,
): null | { routeParams: Record<string, string> } {
  return resolveAsStaticPath(filesystemRoute, urlPathname)
}

function resolveAsStaticPath(filesystemRoute: string, urlPathname: string) {
  urlPathname = removeTrailingSlash(urlPathname)
  // console.log('[Route Candidate] url:' + urlPathname, 'filesystemRoute:' + filesystemRoute)
  assert(urlPathname.startsWith('/'))
  assert(filesystemRoute.startsWith('/'))
  assert(!urlPathname.endsWith('/') || urlPathname === '/')
  assert(!filesystemRoute.endsWith('/') || filesystemRoute === '/')
  if (urlPathname !== filesystemRoute) {
    return null
  }
  return { routeParams: {} }
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
  let filesystemRoute = pageId
  if (root) {
    const { rootPath, rootValue } = root
    assert(filesystemRoute.startsWith(rootPath))
    filesystemRoute = slice(filesystemRoute, rootPath.length, 0)
    assert(filesystemRoute.startsWith('/'), { pageId, rootPath, rootValue })
    filesystemRoute = rootValue + (rootValue.endsWith('/') ? '' : '/') + slice(filesystemRoute, 1, 0)
  }

  // Remove `pages/`, `index/, and `src/`, directories
  filesystemRoute = filesystemRoute.split('/pages/').join('/')
  filesystemRoute = filesystemRoute.split('/src/').join('/')
  filesystemRoute = filesystemRoute.split('/index/').join('/')

  // Hanlde `/index.page.*` suffix
  assert(!filesystemRoute.includes('.page.'))
  if (filesystemRoute.endsWith('/index')) {
    filesystemRoute = slice(filesystemRoute, 0, -'/index'.length)
  }

  if (filesystemRoute === '') {
    filesystemRoute = '/'
  }

  assert(filesystemRoute.startsWith('/'))
  assert(!filesystemRoute.endsWith('/') || filesystemRoute === '/')

  return filesystemRoute
}
