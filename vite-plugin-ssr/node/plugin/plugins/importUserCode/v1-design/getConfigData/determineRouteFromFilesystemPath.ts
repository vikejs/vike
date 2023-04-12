export { determineRouteFromFilesystemPath }

import { assert } from '../../../../utils'
import { determinePageId } from './determinePageId'

function determineRouteFromFilesystemPath(filesystemPath: string): string {
  const pageId = determinePageId(filesystemPath)

  let routeString = pageId

  {
    let paths = routeString.split('/')
    // Ignore directories pages/ renderer/ index/ src/
    paths = paths.filter((dir) => dir !== 'pages' && dir !== 'src' && dir !== 'index' && dir !== 'renderer')
    routeString = paths.join('/')
  }

  if (routeString === '') {
    routeString = '/'
  }

  assert(routeString.startsWith('/'))
  assert(!routeString.endsWith('/') || routeString === '/')

  return routeString
}
