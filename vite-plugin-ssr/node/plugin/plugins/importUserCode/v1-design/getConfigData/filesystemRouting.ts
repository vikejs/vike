export { getRouteFilesystem }
export { getRouteFilesystemDefinedBy }
export { isRelevantConfig }
export { pickMostRelevantConfigValue }
export { isInherited }
export { getLocationId }

import {
  assert,
  assertPosixPath,
  assertWarning,
  getNpmPackageImportPath,
  isNpmPackageImportPath
} from '../../../../utils'
import type { PlusValueFile, PlusConfigFile } from '../getConfigData'
import { getPageConfigValue } from './helpers'

/**
 * getLocationId('/pages/some-page/+Page.js') => '/pages/some-page'
 * getLocationId('/pages/some-page') => '/pages/some-page'
 * getLocationId('/renderer/+config.js') => '/renderer'
 * getLocationId('someNpmPackage/renderer/+config.js') => 'someNpmPackage/renderer'
 */
function getLocationId(somePath: string): string {
  const locationId = removeFilename(somePath, true)
  assert(locationId.startsWith('/') || isNpmPackageImportPath(locationId))
  assert(!locationId.endsWith('/') || locationId === '/')
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

function isRelevantConfig(
  configPath: string, // Can be plusConfigFilePath or plusValueFilePath
  locationId: string
): boolean {
  const inheritanceRoot = getInheritanceRoot(removeFilename(configPath))
  const isRelevant = locationId.startsWith(inheritanceRoot)
  return isRelevant
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

type Candidate = { plusValueFile: PlusValueFile } | { plusConfigFile: PlusConfigFile }

function pickMostRelevantConfigValue(
  configName: string,
  plusValueFilesRelevant: PlusValueFile[],
  plusConfigFilesRelevant: PlusConfigFile[]
): null | Candidate {
  const candidates: Candidate[] = []
  plusValueFilesRelevant.forEach((plusValueFile) => {
    if (plusValueFile.configName === configName) {
      candidates.push({ plusValueFile })
    }
  })
  plusConfigFilesRelevant.forEach((plusConfigFile) => {
    const result = getPageConfigValue(configName, plusConfigFile)
    if (result) {
      candidates.push({
        plusConfigFile: result.plusConfigFile
      })
    }
  })

  if (candidates.length === 0) {
    return null
  }
  let winnerNow = candidates[0]!
  candidates.slice(1).forEach((candidate) => {
    const winnerNowInheritanceRoot = getCandidateInheritanceRoot(winnerNow)
    const candidateInheritanceRoot = getCandidateInheritanceRoot(candidate)
    assert(
      candidateInheritanceRoot.startsWith(winnerNowInheritanceRoot) ||
        winnerNowInheritanceRoot.startsWith(candidateInheritanceRoot)
    )
    const candidateFilePath = getFilePath(candidate)
    const winnerNowFilePath = getFilePath(winnerNow)
    assert(candidateFilePath !== winnerNowFilePath)

    // Filesystem inheritance
    if (candidateInheritanceRoot.length > winnerNowInheritanceRoot.length) {
      winnerNow = candidate
    }

    // Conflict
    if (candidateInheritanceRoot.length === winnerNowInheritanceRoot.length) {
      let ignored: Candidate
      if (
        // Make this config value:
        //   /pages/some-page/+someConfig.js > `export default`
        // override that config value:
        //   /pages/some-page/+config > `export default { someConfig }`
        ('plusValueFile' in candidate && 'plusConfigFile' in winnerNow) ||
        // Make overriding deterministic
        candidateFilePath > winnerNowFilePath
      ) {
        ignored = winnerNow
        winnerNow = candidate
      } else {
        ignored = candidate
      }
      assertWarning(
        false,
        `${getCandidateDefinedAt(ignored, configName)} overriden by ${getCandidateDefinedAt(
          winnerNow,
          configName
        )}, remove one of the two`,
        { onlyOnce: false, showStackTrace: false }
      )
    }
  })
  return winnerNow
}
function getCandidateInheritanceRoot(candidate: Candidate): string {
  const candidateFilePath = getFilePath(candidate)
  const candidateInheritanceRoot = getInheritanceRoot(removeFilename(candidateFilePath))
  return candidateInheritanceRoot
}
function getFilePath(candidate: Candidate) {
  let filePath: string
  if ('plusValueFile' in candidate) {
    filePath = candidate.plusValueFile.plusValueFilePath
  } else {
    filePath = candidate.plusConfigFile.plusConfigFilePath
  }
  return filePath
}
function getCandidateDefinedAt(candidate: Candidate, configName: string): string {
  let configDefinedAt: string
  if ('plusValueFile' in candidate) {
    configDefinedAt = candidate.plusValueFile.plusValueFilePath
  } else {
    configDefinedAt = `${candidate.plusConfigFile.plusConfigFilePath} > ${configName}`
  }
  return configDefinedAt
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
  if( locationId === '/' ) return locationId
  assert(!locationId.endsWith('/'))
  const routeFilesystemDefinedBy = locationId + '/'
  return routeFilesystemDefinedBy
}
