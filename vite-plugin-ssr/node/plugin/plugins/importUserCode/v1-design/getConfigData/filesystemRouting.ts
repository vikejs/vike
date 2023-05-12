export { determineRouteFromFilesystemPath }
export { determineRouteFromPageId }
export { determinePageId }
export { isRelevantConfig }
export { pickMostRelevantConfigValue }

import {
  assert,
  assertPosixPath,
  assertWarning,
  getNpmPackageImportPath,
  isNpmPackageImportPath
} from '../../../../utils'
import type { PlusValueFile, PlusConfigFile } from '../getConfigData'
import { getPageConfigValue } from './helpers'

function determineRouteFromFilesystemPath(somePath: string): string {
  const filesystemPathRoot = getFilesysemPathRoot(somePath)
  return getFilesysemRoute(filesystemPathRoot)
}

function determineRouteFromPageId(pageId: string): string {
  return getFilesysemRoute(pageId)
}

function determinePageId(somePath: string): string {
  const filesystemPathRoot = getFilesysemPathRoot(somePath)
  const pageId = filesystemPathRoot
  return pageId
}

function getFilesysemPathRoot(somePath: string): string {
  const pageId = removeFilename(somePath, true)
  assert(pageId.startsWith('/') || isNpmPackageImportPath(pageId))
  assert(!pageId.endsWith('/') || pageId === '/')
  return pageId
}

function isRelevantConfig(
  configPath: string, // Can be plusConfigFilePath or plusValueFilePath
  pageId: string
): boolean {
  const configApplyRoot = getFilesystemApplyRoot(removeFilename(configPath))
  const isRelevant = pageId.startsWith(configApplyRoot)
  return isRelevant
}

// Get URL determined by filesystem path
function getFilesysemRoute(someDir: string): string {
  return getFilesystemPath(someDir, ['renderer', 'pages', 'src', 'index'])
}
// Get filesystem apply root for config inheritance
function getFilesystemApplyRoot(someDir: string): string {
  return getFilesystemPath(someDir, ['renderer'])
}

function getFilesystemPath(someDir: string, removeDirs: string[]): string {
  assertPosixPath(someDir)
  assert(!someDir.endsWith('/') || someDir === '/')
  if (isNpmPackageImportPath(someDir)) {
    const importPath = getNpmPackageImportPath(someDir)
    assert(importPath)
    assert(!importPath.startsWith('/'))
    someDir = '/' + importPath
  }
  assert(someDir.startsWith('/'))

  let fsPath = someDir
    .split('/')
    .filter((p) => !removeDirs.includes(p))
    .join('/')
  if (fsPath === '') fsPath = '/'

  assert(fsPath.startsWith('/') || isNpmPackageImportPath(fsPath))
  assert(!fsPath.endsWith('/') || fsPath === '/')

  return fsPath
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
    const winnerNowApplyRoot = getCandidateApplyRoot(winnerNow)
    const candidateApplyRoot = getCandidateApplyRoot(candidate)
    assert(candidateApplyRoot.startsWith(winnerNowApplyRoot) || winnerNowApplyRoot.startsWith(candidateApplyRoot))
    const candidateFilePath = getFilePath(candidate)
    const winnerNowFilePath = getFilePath(winnerNow)
    assert(candidateFilePath !== winnerNowFilePath)

    // Filesystem inheritence
    if (candidateApplyRoot.length > winnerNowApplyRoot.length) {
      winnerNow = candidate
    }

    // Conflict
    if (candidateApplyRoot.length === winnerNowApplyRoot.length) {
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
function getCandidateApplyRoot(candidate: Candidate): string {
  const candidateFilePath = getFilePath(candidate)
  const candidateApplyRoot = getFilesystemApplyRoot(removeFilename(candidateFilePath))
  return candidateApplyRoot
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
