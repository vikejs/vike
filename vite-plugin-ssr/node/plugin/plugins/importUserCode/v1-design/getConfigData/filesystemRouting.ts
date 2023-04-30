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
import type { ConfigValueFile, PageConfigFile } from '../getConfigData'
import { getPageConfigValues } from './helpers'

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

type Candidate =
  | { configValueFile: ConfigValueFile }
  | { pageConfigValue: { pageConfigValueFilePath: string; configValue: unknown } }

function pickMostRelevantConfigValue(
  configName: string,
  configValueFilesRelevant: ConfigValueFile[],
  pageConfigFilesRelevant: PageConfigFile[]
): null | Candidate {
  const candidates: Candidate[] = []
  configValueFilesRelevant.forEach((configValueFile) => {
    if (configValueFile.configName === configName) {
      candidates.push({ configValueFile })
    }
  })
  pageConfigFilesRelevant.forEach((configFile) => {
    const pageConfigValues = getPageConfigValues(configFile)
    const configValue = pageConfigValues[configName]
    if (configValue !== undefined) {
      candidates.push({
        pageConfigValue: { pageConfigValueFilePath: configFile.pageConfigFilePath, configValue }
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
      if ('configValueFile' in candidate) {
        assert('pageConfigValue' in winnerNow)
        ignored = winnerNow
        winnerNow = candidate
      } else {
        assert('configValueFile' in winnerNow)
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
  if ('configValueFile' in candidate) {
    filePath = candidate.configValueFile.configValueFilePath
  } else {
    filePath = candidate.pageConfigValue.pageConfigValueFilePath
  }
  const candidateFsRoute = removeIrrelevantParts(removeFilename(filePath), ['renderer', 'pages'])
  return candidateFsRoute
}
function getCandidateDefinedAt(candidate: Candidate, configName: string): string {
  let configDefinedAt: string
  if ('configValueFile' in candidate) {
    configDefinedAt = candidate.configValueFile.configValueFilePath
  } else {
    configDefinedAt = `${candidate.pageConfigValue.pageConfigValueFilePath} > ${configName}`
  }
  return configDefinedAt
}
