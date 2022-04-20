import { assert, higherFirst, slice } from './utils'

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
  if (!url.endsWith('/')) {
    return url
  }
  while (url.endsWith('/')) {
    url = slice(url, 0, -1)
  }
  if (url === '') {
    return '/'
  }
  return url
}

function getFilesystemRoute(pageId: string, filesystemRoots: { rootPath: string; rootValue: string }[]): string {
  // Handle Filesystem Routing Root
  const filesystemRootsMatch = filesystemRoots
    .filter(({ rootPath }) => pageId.startsWith(rootPath))
    .sort(higherFirst(({ rootPath }) => rootPath.length))
  const root = filesystemRootsMatch[0]

  let filesystemRoute: string
  if (root) {
    // Example values:
    //  - `{"pageId":"/pages/index","rootPath":"/","rootValue":"/client_portal"}`
    const { rootPath, rootValue } = root
    const debugInfo = { pageId, rootPath, rootValue }
    assert(rootValue.startsWith('/') && pageId.startsWith('/') && rootPath.startsWith('/'), debugInfo)
    assert(pageId.startsWith(rootPath), debugInfo)
    if (rootPath !== '/') {
      assert(!rootPath.endsWith('/'), debugInfo)
      filesystemRoute = slice(pageId, rootPath.length, 0)
    } else {
      filesystemRoute = pageId
    }
    assert(filesystemRoute.startsWith('/'), debugInfo)
    filesystemRoute = rootValue + (rootValue.endsWith('/') ? '' : '/') + slice(filesystemRoute, 1, 0)
  } else {
    filesystemRoute = pageId
  }

  assert(filesystemRoute.startsWith('/'))

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
