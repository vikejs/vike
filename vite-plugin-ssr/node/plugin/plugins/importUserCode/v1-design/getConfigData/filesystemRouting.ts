export { determineRouteFromFilesystemPath }
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
  configPath: string, // Can be plusConfigFilePath or plusValueFilePath
  pageId: string
): boolean {
  const configFsRoot = getFilesystemRoute(removeFilename(configPath)).fsRoot
  const pageFsRoot = getFilesystemRoute(pageId).fsRoot
  const isRelevant = pageFsRoot.startsWith(configFsRoot)
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
function getFilesystemRoute(somePath: string) {
  const IGNORE_DIRS = ['renderer', 'pages']

  assertPosixPath(somePath)
  if (isNpmPackageImportPath(somePath)) {
    const importPath = getNpmPackageImportPath(somePath)
    assert(importPath)
    assert(!importPath.startsWith('/'))
    somePath = '/' + importPath
  }
  assert(somePath.startsWith('/'))
  const fsRoot = somePath
    .split('/')
    .filter((p) => !IGNORE_DIRS.includes(p))
    .join('/')
  return { fsRoot }
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
    const configValue = getPageConfigValue(configName, plusConfigFile)
    if (configValue !== undefined) {
      candidates.push({
        plusConfigFile
      })
    }
  })

  if (candidates.length === 0) {
    return null
  }
  let winnerNow = candidates[0]!
  candidates.slice(1).forEach((candidate) => {
    const winnerNowFsRoute = getCandidateFsRoute(winnerNow)
    const candidateFsRoute = getCandidateFsRoute(candidate)
    assert(candidateFsRoute.startsWith(winnerNowFsRoute) || winnerNowFsRoute.startsWith(candidateFsRoute))
    if (candidateFsRoute.length > winnerNowFsRoute.length) {
      winnerNow = candidate
    }
    if (candidateFsRoute.length === winnerNowFsRoute.length) {
      let ignored: Candidate
      if ('plusValueFile' in candidate) {
        assert('plusConfigFile' in winnerNow)
        ignored = winnerNow
        winnerNow = candidate
      } else {
        assert('plusValueFile' in winnerNow)
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
function getCandidateFsRoute(candidate: Candidate): string {
  let filePath: string
  if ('plusValueFile' in candidate) {
    filePath = candidate.plusValueFile.plusValueFilePath
  } else {
    filePath = candidate.plusConfigFile.plusConfigFilePath
  }
  const candidateFsRoute = getFilesystemRoute(removeFilename(filePath)).fsRoot
  return candidateFsRoute
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
