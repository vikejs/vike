export { getPlusFilesByLocationId }
export type { PlusFileValue }
export type { PlusFile }
export type { PlusFilesByLocationId }

import { assert } from '../../utils.js'
import { configDefinitionsBuiltIn } from './configDefinitionsBuiltIn.js'
import { type LocationId, getLocationId } from './filesystemRouting.js'
import { type EsbuildCache } from './transpileAndExecuteFile.js'
import { crawlPlusFilePaths, getPlusFileValueConfigName } from './crawlPlusFilePaths.js'
import { getConfigFileExport } from './getConfigFileExport.js'
import { type ConfigFile, loadConfigFile, loadValueFile, PointerImportLoaded } from './loadFileAtConfigTime.js'
import { resolvePointerImport } from './resolvePointerImport.js'
import { getFilePathResolved } from '../getFilePath.js'
import type { FilePathResolved } from '../../../../types/FilePath.js'
import { assertExtensionsConventions, assertExtensionsRequire } from './assertExtensions.js'

type PlusFile = PlusFileConfig | PlusFileValue
type PlusFileCommon = {
  locationId: LocationId
  filePath: FilePathResolved
}
/** +config.js */
type PlusFileConfig = PlusFileCommon & {
  isConfigFile: true
  fileExportsByConfigName: Record<
    string, // configName
    unknown // configValue
  >
  pointerImportsByConfigName: Record<
    string, // configName
    PointerImportLoaded[]
  >
  isExtensionConfig: boolean
  extendsFilePaths: string[]
  // TypeScript convenience
  isNotLoaded?: undefined
}
/** +{configName}.js */
type PlusFileValue = PlusFileCommon & {
  isConfigFile: false
  configName: string
} & (
    | {
        isNotLoaded: false
        fileExportsByConfigName: Record<
          string, // configName
          unknown // configValue
        >
      }
    | {
        isNotLoaded: true
      }
  ) & {
    // TypeScript convenience
    isExtensionConfig?: undefined
  }
type PlusFilesByLocationId = Record<LocationId, PlusFile[]>

async function getPlusFilesByLocationId(
  userRootDir: string,
  esbuildCache: EsbuildCache,
): Promise<PlusFilesByLocationId> {
  const plusFilePaths: FilePathResolved[] = (await crawlPlusFilePaths(userRootDir)).map(
    ({ filePathAbsoluteUserRootDir }) => getFilePathResolved({ filePathAbsoluteUserRootDir, userRootDir }),
  )
  // +config.js files
  const plusFilePathsConfig: FilePathResolved[] = []
  // +{configName}.js files
  const plusFilePathsValue: FilePathResolved[] = []
  plusFilePaths.forEach((f) => {
    if (getPlusFileValueConfigName(f.filePathAbsoluteFilesystem) === 'config') {
      plusFilePathsConfig.push(f)
    } else {
      plusFilePathsValue.push(f)
    }
  })

  const plusFilesByLocationId: PlusFilesByLocationId = {}
  await Promise.all([
    // +config.js files
    ...plusFilePathsConfig.map(async (filePath) => {
      const { filePathAbsoluteUserRootDir } = filePath
      assert(filePathAbsoluteUserRootDir)
      const { configFile, extendsConfigs } = await loadConfigFile(filePath, userRootDir, [], false, esbuildCache)
      assert(filePath.filePathAbsoluteUserRootDir)
      const locationId = getLocationId(filePathAbsoluteUserRootDir)
      const plusFile = getPlusFileFromConfigFile(configFile, false, locationId, userRootDir)

      plusFilesByLocationId[locationId] = plusFilesByLocationId[locationId] ?? []
      plusFilesByLocationId[locationId]!.push(plusFile)
      extendsConfigs.forEach((extendsConfig) => {
        /* We purposely use the same locationId because the Vike extension's config should only apply to where it's being extended from, for example:
        ```js
        // /pages/admin/+config.js

        import vikeVue from 'vike-vue/config'
        // Should only apply to /pages/admin/**
        export default { extends: [vikeVue] }
        ```
        ```js
        // /pages/marketing/+config.js

        import vikeReact from 'vike-react/config'
        // Should only apply to /pages/marketing/**
        export default { extends: [vikeReact] }
        ```
        */
        const plusFile = getPlusFileFromConfigFile(extendsConfig, true, locationId, userRootDir)
        assertExtensionsConventions(plusFile)
        plusFilesByLocationId[locationId]!.push(plusFile)
      })
    }),
    // +{configName}.js files
    ...plusFilePathsValue.map(async (filePath) => {
      const { filePathAbsoluteUserRootDir } = filePath
      assert(filePathAbsoluteUserRootDir)

      const configName = getPlusFileValueConfigName(filePathAbsoluteUserRootDir)
      assert(configName)

      const locationId = getLocationId(filePathAbsoluteUserRootDir)

      const plusFile: PlusFileValue = {
        locationId,
        filePath,
        isConfigFile: false,
        isNotLoaded: true,
        configName,
      }
      plusFilesByLocationId[locationId] = plusFilesByLocationId[locationId] ?? []
      plusFilesByLocationId[locationId]!.push(plusFile)

      // We don't have access to the custom config definitions defined by the user yet.
      //  - If `configDef` is `undefined` => we load the file +{configName}.js later.
      //  - We already need to load +meta.js here (to get the custom config definitions defined by the user)
      await loadValueFile(plusFile, configDefinitionsBuiltIn, userRootDir, esbuildCache)
    }),
  ])

  // Make lists element order deterministic
  Object.entries(plusFilesByLocationId).forEach(([_locationId, plusFiles]) => {
    plusFiles.sort(sortMakeDeterministic)
  })

  assertPlusFiles(plusFilesByLocationId)
  return plusFilesByLocationId
}
function assertPlusFiles(plusFilesByLocationId: PlusFilesByLocationId) {
  const plusFiles = Object.values(plusFilesByLocationId).flat()
  // The earlier we call it the better, so that +require can be used by Vike extensions to depend on new Vike features
  assertExtensionsRequire(plusFiles)
}

// TODO: rename
function getPlusFileFromConfigFile(
  configFile: ConfigFile,
  isExtensionConfig: boolean,
  locationId: LocationId,
  userRootDir: string,
): PlusFile {
  const { fileExports, filePath, extendsFilePaths } = configFile

  const fileExportsByConfigName: PlusFileConfig['fileExportsByConfigName'] = {}
  const pointerImportsByConfigName: PlusFileConfig['pointerImportsByConfigName'] = {}
  const fileExport = getConfigFileExport(fileExports, filePath.filePathToShowToUser)
  Object.entries(fileExport).forEach(([configName, configValue]) => {
    fileExportsByConfigName[configName] = configValue

    // Pointer imports
    const values = Array.isArray(configValue) ? configValue : [configValue]
    const pointerImports = values
      .map((value) => resolvePointerImport(value, configFile.filePath, userRootDir, configName))
      .filter((pointerImport) => pointerImport !== null)
      .map((pointerImport) => ({ ...pointerImport, fileExportValueLoaded: false as const }))
    if (pointerImports.length > 0) {
      pointerImportsByConfigName[configName] = pointerImports
    }
  })

  const plusFile: PlusFileConfig = {
    locationId,
    filePath,
    fileExportsByConfigName,
    pointerImportsByConfigName,
    isConfigFile: true,
    isExtensionConfig,
    extendsFilePaths,
  }
  return plusFile
}

// Make order deterministic (no other purpose)
function sortMakeDeterministic(plusFile1: PlusFile, plusFile2: PlusFile): 0 | -1 | 1 {
  return plusFile1.filePath.filePathAbsoluteVite < plusFile2.filePath.filePathAbsoluteVite ? -1 : 1
}
