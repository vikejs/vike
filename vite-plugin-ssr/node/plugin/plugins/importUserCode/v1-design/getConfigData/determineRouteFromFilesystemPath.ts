export { determineRouteFromFilesystemPath }

import { assert, getNpmPackageImportPath, isNpmPackageImportPath } from '../../../../utils'
import { determinePageId } from './determinePageId'

function determineRouteFromFilesystemPath(dirOrFilePath: string): string {
  const pageId = determinePageId(dirOrFilePath)

  let routeString = pageId
  if (isNpmPackageImportPath(routeString)) {
    const importPath = getNpmPackageImportPath(routeString) ?? ''
    assert(!importPath.startsWith('/'))
    routeString = '/' + importPath
  }
  assert(routeString.startsWith('/'))

  {
    let paths = routeString.split('/')
    // Ignore directories pages/ renderer/ index/ src/
    paths = paths.filter((dir) => dir !== 'pages' && dir !== 'src' && dir !== 'index' && dir !== 'renderer')
    routeString = paths.join('/')
  }

  if (routeString === '') {
    routeString = '/'
  }

  assert(routeString.startsWith('/') || isNpmPackageImportPath(routeString))
  assert(!routeString.endsWith('/') || routeString === '/')

  return routeString
}
