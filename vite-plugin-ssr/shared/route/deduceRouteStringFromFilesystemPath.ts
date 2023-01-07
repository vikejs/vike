import { assert, higherFirst, slice } from './utils'

export { deduceRouteStringFromFilesystemPath }
export { determineRouteFromFilesystemPath }
export { determinePageId2 }
export type { FilesystemRoot }

type FilesystemRoot = {
  filesystemRoot: string
  routeRoot: string
}

// TODO/next-major-update: remove this and whole filesystemRoot mechanism
function deduceRouteStringFromFilesystemPath(pageId: string, filesystemRoots: FilesystemRoot[]): string {
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

// TODO make deduceRouteStringFromFilesystemPath() use determineRouteFromFilesystemPath()
function determineRouteFromFilesystemPath(filesystemPath: string): string {
  const pageId2 = determinePageId2(filesystemPath)

  let routeString = pageId2

  {
    let paths = routeString.split('/')
    // Remove `pages/`, `index/, and `src/`, directories
    paths = paths.filter((dir) => dir !== 'pages' && dir !== 'src' && dir !== 'index')
    routeString = paths.join('/')
  }

  if (routeString === '') {
    routeString = '/'
  }

  assert(routeString.startsWith('/'))
  assert(!routeString.endsWith('/') || routeString === '/')

  return routeString
}

function determinePageId2(filesystemPath: string): string {
  assertFilesystemPath(filesystemPath)

  let paths = filesystemPath.split('/')

  // Remove filename e.g. `+config.js`
  {
    const last = paths[paths.length - 1]!
    if (last.includes('.')) {
      paths = paths.slice(0, -1)
    }
  }

  const pageId2 = paths.join('/')
  assert(pageId2.startsWith('/'))
  assert(
    !pageId2.endsWith('/') ||
      // Unlikely, but may happen
      pageId2 === '/'
  )
  return pageId2
}

function assertFilesystemPath(filesystemPath: string): void {
  assert(!filesystemPath.includes('\\'))
  assert(filesystemPath.startsWith('/'))
}
