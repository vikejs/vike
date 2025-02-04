// Files loaded at config time:

export { loadPointerImport }
export { loadValueFile }
export { loadConfigFile }
export type { ImportedFilesLoaded }
export type { ConfigFile }
export type { PointerImportLoaded }

import {
  assert,
  assertUsage,
  assertIsNotProductionRuntime,
  isArrayOfStrings,
  isObject,
  genPromise
} from '../../../../utils.js'
import type { FilePathResolved } from '../../../../../../shared/page-configs/FilePath.js'
import { transpileAndExecuteFile } from './transpileAndExecuteFile.js'
import { getConfigDefinition, getConfigDefinitionOptional, type InterfaceValueFile } from '../getVikeConfig.js'
import { assertPlusFileExport } from '../../../../../../shared/page-configs/assertPlusFileExport.js'
import pc from '@brillout/picocolors'
import { type PointerImportData, parsePointerImportData } from './transformPointerImports.js'
import { getConfigFileExport } from '../getConfigFileExport.js'
import { PointerImport, resolvePointerImportData } from './resolvePointerImport.js'
import type { ConfigDefinitionInternal, ConfigDefinitions } from './configDefinitionsBuiltIn.js'
import { getConfigDefinedAt } from '../../../../../../shared/page-configs/getConfigDefinedAt.js'

assertIsNotProductionRuntime()

type ImportedFilesLoaded = Record<string, Promise<Record<string, unknown>>>
type ConfigFile = {
  fileExports: Record<string, unknown>
  filePath: FilePathResolved
  extendsFilePaths: string[]
}

// Load pointer import
async function loadPointerImport(
  pointerImport: PointerImportLoaded,
  userRootDir: string,
  configName: string,
  configDefinitions: ConfigDefinitions
): Promise<unknown> {
  // The value of `extends` was already loaded and already used: we don't need the value of `extends` anymore
  if (configName === 'extends') return
  const configDef = getConfigDefinition(configDefinitions, configName)
  // Only load pointer import if `env.config===true`
  if (!shouldBeLoadableAtBuildTime(configDef)) return

  if (pointerImport.fileExportValueLoaded) {
    await pointerImport.fileExportValueLoaded
    if (
      // Help TS
      true as boolean
    )
      return
  }
  const { promise, resolve } = genPromise()
  pointerImport.fileExportValueLoaded = promise
  assert(pointerImport.fileExportValueLoaded)

  const configDefinedAt = getConfigDefinedAt('Config', configName, pointerImport.fileExportPath)
  assertUsage(
    pointerImport.fileExportPath.filePathAbsoluteFilesystem,
    `${configDefinedAt} cannot be defined over an aliased import`
  )
  const { fileExports } = await transpileAndExecuteFile(pointerImport.fileExportPath, userRootDir, false)
  const fileExportValue = fileExports[pointerImport.fileExportPath.fileExportName]
  pointerImport.fileExportValue = fileExportValue

  resolve()
}
type PointerImportLoaded = PointerImport &
  (
    | {
        fileExportValueLoaded: Promise<void>
        fileExportValue: unknown
      }
    | {
        fileExportValueLoaded: false
      }
  )

// Load +{configName}.js
async function loadValueFile(
  interfaceValueFile: InterfaceValueFile,
  configDefinitions: ConfigDefinitions,
  userRootDir: string
): Promise<void> {
  const { configName } = interfaceValueFile
  const configDef = getConfigDefinitionOptional(configDefinitions, configName)
  // Only load value files with `env.config===true`
  if (!configDef || !shouldBeLoadableAtBuildTime(configDef)) return
  if (interfaceValueFile.isValueFileLoaded) {
    await interfaceValueFile.isValueFileLoaded
    if (
      // Help TS
      true as boolean
    )
      return
  }
  const { promise, resolve } = genPromise()
  interfaceValueFile.isValueFileLoaded = promise
  assert(interfaceValueFile.isValueFileLoaded)
  interfaceValueFile.fileExportsByConfigName = {}
  const { fileExports } = await transpileAndExecuteFile(interfaceValueFile.filePath, userRootDir, false)
  resolve()
  const { filePathToShowToUser } = interfaceValueFile.filePath
  assertPlusFileExport(fileExports, filePathToShowToUser, configName)
  Object.entries(fileExports).forEach(([exportName, configValue]) => {
    const configName_ = exportName === 'default' ? configName : exportName
    interfaceValueFile.fileExportsByConfigName[configName_] = configValue
  })
}

// Load +config.js, including all its extends pointer imports
async function loadConfigFile(
  configFilePath: FilePathResolved,
  userRootDir: string,
  visited: string[],
  isExtensionConfig: boolean
): Promise<{ configFile: ConfigFile; extendsConfigs: ConfigFile[] }> {
  const { filePathAbsoluteFilesystem } = configFilePath
  assertNoInfiniteLoop(visited, filePathAbsoluteFilesystem)
  const { fileExports } = await transpileAndExecuteFile(
    configFilePath,
    userRootDir,
    isExtensionConfig ? 'is-extension-config' : true
  )
  const { extendsConfigs, extendsFilePaths } = await loadExtendsConfigs(fileExports, configFilePath, userRootDir, [
    ...visited,
    filePathAbsoluteFilesystem
  ])

  const configFile: ConfigFile = {
    fileExports,
    filePath: configFilePath,
    extendsFilePaths
  }
  return { configFile, extendsConfigs }
}
function assertNoInfiniteLoop(visited: string[], filePathAbsoluteFilesystem: string) {
  const idx = visited.indexOf(filePathAbsoluteFilesystem)
  if (idx === -1) return
  const loop = visited.slice(idx)
  assert(loop[0] === filePathAbsoluteFilesystem)
  assertUsage(idx === -1, `Infinite extends loop ${[...loop, filePathAbsoluteFilesystem].join('>')}`)
}
async function loadExtendsConfigs(
  configFileExports: Record<string, unknown>,
  configFilePath: FilePathResolved,
  userRootDir: string,
  visited: string[]
) {
  const { extendsPointerImportData, extendsConfigs } = getExtendsPointerImportData(configFileExports, configFilePath)
  const extendsConfigFiles: FilePathResolved[] = []
  extendsPointerImportData.map((pointerImportData) => {
    const filePath = resolvePointerImportData(pointerImportData, configFilePath, userRootDir)
    assert(filePath.filePathAbsoluteFilesystem)
    extendsConfigFiles.push(filePath)
  })

  const results = await Promise.all(
    extendsConfigFiles.map(async (configFilePath) => await loadConfigFile(configFilePath, userRootDir, visited, true))
  )
  results.forEach((result) => {
    extendsConfigs.push(result.configFile)
    extendsConfigs.push(...result.extendsConfigs)
  })

  const extendsFilePaths = extendsConfigFiles.map((f) => f.filePathAbsoluteFilesystem)

  return { extendsConfigs, extendsFilePaths }
}
function getExtendsPointerImportData(configFileExports: Record<string, unknown>, configFilePath: FilePathResolved) {
  const { filePathToShowToUser } = configFilePath
  const configFileExport = getConfigFileExport(configFileExports, filePathToShowToUser)
  const extendsConfigs: ConfigFile[] = []
  const extendsPointerImportData: PointerImportData[] = []
  if ('extends' in configFileExport) {
    const extendsValue = configFileExport.extends
    const extendList: string[] = []
    const wrongUsage = `${filePathToShowToUser} sets the config ${pc.cyan(
      'extends'
    )} to an invalid value, see https://vike.dev/extends`
    if (typeof extendsValue === 'string') {
      extendList.push(extendsValue)
    } else if (isArrayOfStrings(extendsValue)) {
      extendList.push(...extendsValue)
    } else if (isObject(extendsValue)) {
      /* If we want to implement this then we need to make filePath optional
      extendsConfigs.push({
        fileExports: extendsValue,
        filePath: null,
      })
      */
      assertUsage(false, wrongUsage)
    } else {
      assertUsage(false, wrongUsage)
    }
    extendsPointerImportData.push(
      ...extendList.map((importString) => {
        const pointerImportData = parsePointerImportData(importString)
        assertUsage(pointerImportData, wrongUsage)
        return pointerImportData
      })
    )
  }
  return { extendsPointerImportData, extendsConfigs }
}

function shouldBeLoadableAtBuildTime(configDef: ConfigDefinitionInternal): boolean {
  return !!configDef.env.config && !configDef._valueIsFilePath
}
