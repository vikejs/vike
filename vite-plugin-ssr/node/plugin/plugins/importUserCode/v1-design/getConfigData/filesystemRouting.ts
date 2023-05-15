export { getRouteFilesystem }
export { getRouteFilesystemDefinedBy }
export { isInherited }
export { getLocationId }
export { sortAfterInheritanceOrder }
export { isGlobalLocation }

import {
  assert,
  assertPosixPath,
  getNpmPackageImportPath,
  isNpmPackageImportPath,
  higherFirst
} from '../../../../utils'

/**
 * getLocationId('/pages/some-page/+Page.js') => '/pages/some-page'
 * getLocationId('/pages/some-page') => '/pages/some-page'
 * getLocationId('/renderer/+config.js') => '/renderer'
 * getLocationId('someNpmPackage/renderer/+config.js') => 'someNpmPackage/renderer'
 */
function getLocationId(somePath: string): string {
  const locationId = removeFilename(somePath, true)
  assertLocationId(locationId)
  return locationId
}
/** Get URL determined by filesystem path */
function getRouteFilesystem(locationId: string): string {
  return getLogialPath(locationId, ['renderer', 'pages', 'src', 'index'])
}
/** Get apply root for config inheritance **/
function getInheritanceRoot(someDir: string): string {
  return getLogialPath(someDir, ['renderer'])
}
/**
 * getLogialPath('/pages/some-page', ['pages']) => '/some-page'
 * getLogialPath('someNpmPackage/renderer', ['renderer']) => '/'
 */
function getLogialPath(someDir: string, removeDirs: string[]): string {
  someDir = removeNpmPackageName(someDir)
  someDir = removeDirectories(someDir, removeDirs)
  assert(someDir.startsWith('/'))
  assert(!someDir.endsWith('/') || someDir === '/')
  return someDir
}

function isGlobalLocation(locationId: string): boolean {
  const inheritanceRoot = getInheritanceRoot(locationId)
  assert(inheritanceRoot.startsWith('/'))
  return inheritanceRoot === '/'
}
function sortAfterInheritanceOrder(locationId1: string, locationId2: string, locationIdPage: string): -1 | 1 | 0 {
  const inheritanceRoot1 = getInheritanceRoot(locationId1)
  const inheritanceRoot2 = getInheritanceRoot(locationId2)
  const inheritanceRootPage = getInheritanceRoot(locationIdPage)

  // sortAfterInheritanceOrder() only works if both locationId1 and locationId2 are inherited by the same page
  assert(isInherited(locationId1, locationIdPage))
  assert(isInherited(locationId2, locationIdPage))
  // Equivalent assertion (see isInherited() implementation)
  assert(inheritanceRootPage.startsWith(inheritanceRoot1))
  assert(inheritanceRootPage.startsWith(inheritanceRoot2))

  // Should be true since locationId1 and locationId2 are both inherited by the same page
  assert(inheritanceRoot1.startsWith(inheritanceRoot2) || inheritanceRoot2.startsWith(inheritanceRoot1))
  // Should be true since we aggregate interface files by locationId
  assert(inheritanceRoot1 !== inheritanceRoot2)
  assert(inheritanceRoot1.length !== inheritanceRoot2.length)

  return higherFirst<string>((inheritanceRoot) => inheritanceRoot.length)(inheritanceRoot1, inheritanceRoot2)
}

function isInherited(locationId: string, locationIdPage: string): boolean {
  const inheritanceRoot = getInheritanceRoot(locationId)
  const inheritanceRootPage = getInheritanceRoot(locationIdPage)
  return inheritanceRootPage.startsWith(inheritanceRoot)
}

function removeNpmPackageName(somePath: string): string {
  if (!isNpmPackageImportPath(somePath)) {
    return somePath
  }
  const importPath = getNpmPackageImportPath(somePath)
  assert(importPath)
  assertPosixPath(importPath)
  assert(!importPath.startsWith('/'))
  somePath = '/' + importPath
  return somePath
}
function removeDirectories(somePath: string, removeDirs: string[]): string {
  assertPosixPath(somePath)
  somePath = somePath
    .split('/')
    .filter((p) => !removeDirs.includes(p))
    .join('/')
  if (somePath === '') somePath = '/'
  return somePath
}

function removeFilename(filePath: string, optional?: true) {
  assertPosixPath(filePath)
  assert(filePath.startsWith('/') || isNpmPackageImportPath(filePath))
  {
    const filename = filePath.split('/').slice(-1)[0]!
    if (!filename.includes('.')) {
      assert(optional)
      return filePath
    }
  }
  filePath = filePath.split('/').slice(0, -1).join('/')
  if (filePath === '') filePath = '/'
  assert(filePath.startsWith('/') || isNpmPackageImportPath(filePath))
  assert(!filePath.endsWith('/') || filePath === '/')
  return filePath
}

function getRouteFilesystemDefinedBy(locationId: string) {
  if (locationId === '/') return locationId
  assert(!locationId.endsWith('/'))
  const routeFilesystemDefinedBy = locationId + '/'
  return routeFilesystemDefinedBy
}

function assertLocationId(locationId: string) {
  assert(locationId.startsWith('/') || isNpmPackageImportPath(locationId))
  assert(!locationId.endsWith('/') || locationId === '/')
}
