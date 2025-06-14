// Unit tests at ./deduceRouteStringFromFilesystemPath.spec.ts

import { assert, higherFirst, slice } from './utils.js'

export { deduceRouteStringFromFilesystemPath }
export type { FilesystemRoot }

type FilesystemRoot = {
  filesystemRoot: string
  urlRoot: string
}

// TODO/next-major-update: remove this and whole filesystemRoot mechanism
function deduceRouteStringFromFilesystemPath(pageId: string, filesystemRoots: FilesystemRoot[]): string {
  // Handle Filesystem Routing Root
  const filesystemRootsMatch = filesystemRoots
    .filter(({ filesystemRoot }) => pageId.startsWith(filesystemRoot))
    .sort(higherFirst(({ filesystemRoot }) => filesystemRoot.length))
  const fsBase = filesystemRootsMatch[0]

  let filesystemRoute: string
  if (fsBase) {
    // Example values:
    //  - `{"pageId":"/pages/index","filesystemRoot":"/","urlRoot":"/client_portal"}`
    const { filesystemRoot, urlRoot } = fsBase
    const debugInfo = { pageId, filesystemRoot, urlRoot }
    assert(urlRoot.startsWith('/') && pageId.startsWith('/') && filesystemRoot.startsWith('/'), debugInfo)
    assert(pageId.startsWith(filesystemRoot), debugInfo)
    if (filesystemRoot !== '/') {
      assert(!filesystemRoot.endsWith('/'), debugInfo)
      filesystemRoute = slice(pageId, filesystemRoot.length, 0)
    } else {
      filesystemRoute = pageId
    }
    assert(filesystemRoute.startsWith('/'), debugInfo)
    filesystemRoute = urlRoot + (urlRoot.endsWith('/') ? '' : '/') + slice(filesystemRoute, 1, 0)
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
