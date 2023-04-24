export { determineRouteFromFilesystemPath }
export { determinePageId }
export { isRelevantConfig }

import { assert, assertPosixPath, getNpmPackageImportPath, isNpmPackageImportPath } from '../../../../utils'

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

function determinePageId(somePath: string): string {
  assert(!somePath.includes('\\'))
  assert(somePath.startsWith('/') || isNpmPackageImportPath(somePath))

  let paths = somePath.split('/')
  assert(paths.length > 1)

  // Remove filename e.g. `+config.js`
  {
    const last = paths[paths.length - 1]!
    if (last.includes('.')) {
      paths = paths.slice(0, -1)
    }
  }

  const pageId = paths.join('/')

  assert(pageId.startsWith('/') || isNpmPackageImportPath(pageId))
  assert(
    !pageId.endsWith('/') ||
      // Unlikely, but may happen
      pageId === '/'
  )

  return pageId
}

function isRelevantConfig(
  configPath: string, // Can be pageConfigFilePath or configValueFilePath
  pageId: string
): boolean {
  const configFsRoot = removeIrrelevantParts(removeFilename(configPath), ['renderer', 'pages'])
  const isRelevant = removeIrrelevantParts(pageId, ['pages']).startsWith(configFsRoot)
  return isRelevant
}
function removeFilename(somePath: string) {
  assertPosixPath(somePath)
  assert(somePath.startsWith('/') || isNpmPackageImportPath(somePath))
  {
    const filename = somePath.split('/').slice(-1)[0]!
    assert(filename.includes('.'))
    assert(filename.startsWith('+'))
  }
  return somePath.split('/').slice(0, -1).join('/')
}
function removeIrrelevantParts(somePath: string, dirs: string[]) {
  assertPosixPath(somePath)
  if (isNpmPackageImportPath(somePath)) {
    const importPath = getNpmPackageImportPath(somePath)
    assert(importPath)
    assert(!importPath.startsWith('/'))
    somePath = '/' + importPath
  }
  assert(somePath.startsWith('/'))
  return somePath
    .split('/')
    .filter((p) => !dirs.includes(p))
    .join('/')
}
