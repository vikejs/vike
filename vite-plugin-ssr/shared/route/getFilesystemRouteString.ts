import { isStaticRouteString } from './resolveRouteString'
import { assert, higherFirst, slice } from './utils'

export { getFilesystemRouteString }
export { getUrlFromFilesystemRouteString }
export type { FilesystemRoot }

type FilesystemRoot = {
  filesystemRoot: string
  routeRoot: string
}

function getUrlFromFilesystemRouteString(filesystemRouteString: string): null | string {
  if (isStaticRouteString(filesystemRouteString)) {
    const url = filesystemRouteString
    return url
  }
  return null
}

function getFilesystemRouteString(pageId: string, filesystemRoots: FilesystemRoot[]): string {
  // Handle Filesystem Routing Root
  const filesystemRootsMatch = filesystemRoots
    .filter(({ filesystemRoot }) => pageId.startsWith(filesystemRoot))
    .sort(higherFirst(({ filesystemRoot }) => filesystemRoot.length))
  const fsRoot = filesystemRootsMatch[0]

  let filesystemRoute: string
  if (fsRoot) {
    // Example values:
    //  - `{"pageId":"/pages/index","filesystemRoot":"/","routeRoot":"/client_portal"}`
    const { filesystemRoot, routeRoot } = fsRoot
    const debugInfo = { pageId, filesystemRoot, routeRoot }
    assert(routeRoot.startsWith('/') && pageId.startsWith('/') && filesystemRoot.startsWith('/'), debugInfo)
    assert(pageId.startsWith(filesystemRoot), debugInfo)
    if (filesystemRoot !== '/') {
      assert(!filesystemRoot.endsWith('/'), debugInfo)
      filesystemRoute = slice(pageId, filesystemRoot.length, 0)
    } else {
      filesystemRoute = pageId
    }
    assert(filesystemRoute.startsWith('/'), debugInfo)
    filesystemRoute = routeRoot + (routeRoot.endsWith('/') ? '' : '/') + slice(filesystemRoute, 1, 0)
  } else {
    filesystemRoute = pageId
  }

  assert(filesystemRoute.startsWith('/'))

  // Remove `pages/`, `index/, and `src/`, directories
  filesystemRoute = filesystemRoute
    .split('/')
    .filter((dir) => dir !== 'pages' && dir !== 'src' && dir !== 'index')
    .join('/')

  // Hanlde `/index.page.*` suffix
  assert(!filesystemRoute.includes('.page.'))
  assert(!filesystemRoute.endsWith('.'))
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
