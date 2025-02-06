export { getPlusFilesAll }
export { getPlusFileValueConfigName }
export type { PlusFileValue }
export type { PlusFile }
export type { PlusFilesByLocationId }

import { assert, assertPosixPath, assertUsage } from '../../../../utils.js'
import { configDefinitionsBuiltIn } from './configDefinitionsBuiltIn.js'
import { type LocationId, getLocationId } from './filesystemRouting.js'
import { isTemporaryBuildFile, type EsbuildCache } from './transpileAndExecuteFile.js'
import { crawlPlusFiles } from './crawlPlusFiles.js'
import { getConfigFileExport } from './getConfigFileExport.js'
import { type ConfigFile, loadConfigFile, loadValueFile, PointerImportLoaded } from './loadFileAtConfigTime.js'
import { resolvePointerImport } from './resolvePointerImport.js'
import { getFilePathResolved } from '../../../../shared/getFilePath.js'
import type { FilePathResolved } from '../../../../../../shared/page-configs/FilePath.js'
import { assertExtensionsConventions } from './assertExtensions.js'
import path from 'node:path'

type PlusFile = PlusFileConfig | PlusFileValue
type PlusFileCommons = {
  locationId: LocationId
  filePath: FilePathResolved
}
// +config.js
type PlusFileConfig = PlusFileCommons & {
  isConfigFile: true
  fileExportsByConfigName: Record<
    string, // configName
    unknown // configValue
  >
  pointerImportsByConfigName: Record<
    string, // configName
    PointerImportLoaded
  >
  isExtensionConfig: boolean
  extendsFilePaths: string[]
  // TypeScript convenience
  isNotLoaded?: undefined
}
// +{configName}.js
type PlusFileValue = PlusFileCommons & {
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

async function getPlusFilesAll(userRootDir: string, esbuildCache: EsbuildCache): Promise<PlusFilesByLocationId> {
  const plusFiles = await findPlusFiles(userRootDir, null)
  const configFiles: FilePathResolved[] = []
  const valueFiles: FilePathResolved[] = []
  plusFiles.forEach((f) => {
    if (getPlusFileValueConfigName(f.filePathAbsoluteFilesystem) === 'config') {
      configFiles.push(f)
    } else {
      valueFiles.push(f)
    }
  })

  let plusFilesAll: PlusFilesByLocationId = {}

  await Promise.all([
    // Config files
    ...configFiles.map(async (filePath) => {
      const { filePathAbsoluteUserRootDir } = filePath
      assert(filePathAbsoluteUserRootDir)
      const { configFile, extendsConfigs } = await loadConfigFile(filePath, userRootDir, [], false, esbuildCache)
      assert(filePath.filePathAbsoluteUserRootDir)
      const locationId = getLocationId(filePathAbsoluteUserRootDir)
      const plusFile = getPlusFileFromConfigFile(configFile, false, locationId, userRootDir)

      plusFilesAll[locationId] = plusFilesAll[locationId] ?? []
      plusFilesAll[locationId]!.push(plusFile)
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
        plusFilesAll[locationId]!.push(plusFile)
      })
    }),
    // Value files
    ...valueFiles.map(async (filePath) => {
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
        configName
      }
      plusFilesAll[locationId] = plusFilesAll[locationId] ?? []
      plusFilesAll[locationId]!.push(plusFile)

      // We don't have access to the custom config definitions defined by the user yet.
      //  - If `configDef` is `undefined` => we load the file +{configName}.js later.
      //  - We already need to load +meta.js here (to get the custom config definitions defined by the user)
      await loadValueFile(plusFile, configDefinitionsBuiltIn, userRootDir, esbuildCache)
    })
  ])

  // Make lists element order deterministic
  Object.entries(plusFilesAll).forEach(([_locationId, plusFiles]) => {
    plusFiles.sort(sortMakeDeterministic)
  })

  return plusFilesAll
}

function getPlusFileFromConfigFile(
  configFile: ConfigFile,
  isExtensionConfig: boolean,
  locationId: LocationId,
  userRootDir: string
): PlusFile {
  const { fileExports, filePath, extendsFilePaths } = configFile

  const fileExportsByConfigName: PlusFileConfig['fileExportsByConfigName'] = {}
  const pointerImportsByConfigName: PlusFileConfig['pointerImportsByConfigName'] = {}
  const fileExport = getConfigFileExport(fileExports, filePath.filePathToShowToUser)
  Object.entries(fileExport).forEach(([configName, configValue]) => {
    fileExportsByConfigName[configName] = configValue
    const pointerImport = resolvePointerImport(configValue, configFile.filePath, userRootDir, configName)
    if (pointerImport) {
      pointerImportsByConfigName[configName] = {
        ...pointerImport,
        fileExportValueLoaded: false
      }
    }
  })

  const plusFile: PlusFileConfig = {
    locationId,
    filePath,
    fileExportsByConfigName,
    pointerImportsByConfigName,
    isConfigFile: true,
    isExtensionConfig,
    extendsFilePaths
  }
  return plusFile
}

// Make order deterministic (no other purpose)
function sortMakeDeterministic(plusFile1: PlusFile, plusFile2: PlusFile): 0 | -1 | 1 {
  return plusFile1.filePath.filePathAbsoluteVite < plusFile2.filePath.filePathAbsoluteVite ? -1 : 1
}

async function findPlusFiles(userRootDir: string, outDirRoot: null | string): Promise<FilePathResolved[]> {
  const files = await crawlPlusFiles(userRootDir, outDirRoot)

  const plusFiles: FilePathResolved[] = files.map(({ filePathAbsoluteUserRootDir }) =>
    getFilePathResolved({ filePathAbsoluteUserRootDir, userRootDir })
  )

  return plusFiles
}

function getPlusFileValueConfigName(filePath: string): string | null {
  assertPosixPath(filePath)
  if (isTemporaryBuildFile(filePath)) return null
  const fileName = path.posix.basename(filePath)
  // assertNoUnexpectedPlusSign(filePath, fileName)
  const basename = fileName.split('.')[0]!
  if (!basename.startsWith('+')) {
    return null
  } else {
    const configName = basename.slice(1)
    assertUsage(configName !== '', `${filePath} Invalid filename ${fileName}`)
    return configName
  }
}
/* https://github.com/vikejs/vike/issues/1407
function assertNoUnexpectedPlusSign(filePath: string, fileName: string) {
  const dirs = path.posix.dirname(filePath).split('/')
  dirs.forEach((dir, i) => {
    const dirPath = dirs.slice(0, i + 1).join('/')
    assertUsage(
      !dir.includes('+'),
      `Character '+' is a reserved character: remove '+' from the directory name ${dirPath}/`
    )
  })
  assertUsage(
    !fileName.slice(1).includes('+'),
    `Character '+' is only allowed at the beginning of filenames: make sure ${filePath} doesn't contain any '+' in its filename other than its first letter`
  )
}
*/
