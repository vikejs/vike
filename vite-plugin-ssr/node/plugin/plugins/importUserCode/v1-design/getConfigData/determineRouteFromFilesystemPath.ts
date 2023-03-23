export { determineRouteFromFilesystemPath }

import { assert } from '../../../../utils'
import { determinePageId } from './determinePageId'

function determineRouteFromFilesystemPath(filesystemPath: string): string {
  const pageId2 = determinePageId(filesystemPath)

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
