export { getConfigData }

import {
  assertPosixPath,
  assert,
  isObject,
  assertUsage,
  // isPosixPath,
  toPosixPath,
  assertWarning,
  addFileExtensionsToRequireResolve,
  assertDefaultExportUnknown,
  assertDefaultExportObject,
  objectEntries,
  hasProp,
  arrayIncludes,
  objectKeys,
  assertIsVitePluginCode,
  getMostSimilar,
  isNpmPackageModule
} from '../../../utils'
import path from 'path'
import type {
  ConfigNameBuiltIn,
  ConfigElement,
  ConfigEnv,
  PageConfigData,
  PageConfigGlobalData
} from '../../../../../shared/page-configs/PageConfig'
import { configDefinitionsBuiltIn, type ConfigDefinition } from './getConfigData/configDefinitionsBuiltIn'
import glob from 'fast-glob'
import type { ExtensionResolved } from '../../../../../shared/ConfigVps'
import {
  getRouteFilesystem,
  getLocationId,
  isInherited,
  getRouteFilesystemDefinedBy,
  sortAfterInheritanceOrder,
  isGlobalLocation
} from './getConfigData/filesystemRouting'
import { transpileAndLoadConfigFile, transpileAndLoadValueFile } from './transpileAndLoadFile'
import { ImportData, parseImportData } from './replaceImportStatements'

assertIsVitePluginCode()

type InterfaceFile = InterfaceConfigFile | InterfaceValueFile
type InterfaceFileCommons = {
  filePathAbsolute: string
  filePathRelativeToUserRootDir: null | string
  configMap: Record<ConfigName, { configValue?: unknown }>
}
type InterfaceConfigFile = InterfaceFileCommons & {
  isConfigFile: true
  isValueFile: false
  extendsFilePaths: string[]
  isConfigExtend: boolean
}
type InterfaceValueFile = InterfaceFileCommons & {
  isConfigFile: false
  isValueFile: true
  configNameDefault: string
  // All value files are +someConfig.js file living in user-land => filePathRelativeToUserRootDir is always defined
  filePathRelativeToUserRootDir: string
}
type ConfigName = string
type LocationId = string
type InterfaceFilesByLocationId = Record<LocationId, InterfaceFile[]>

type ConfigData = {
  pageConfigsData: PageConfigData[]
  pageConfigGlobal: PageConfigGlobalData
  vikeConfig: Record<string, unknown>
  configFilesAll: Set<string>
}
let configDataPromise: Promise<ConfigData> | null = null
let isFirstInvalidation = true

type ConfigDefinitionsIncludingCustom = Record<string, ConfigDefinition>

type GlobalConfigName =
  | 'onPrerenderStart'
  | 'onBeforeRoute'
  | 'prerender'
  | 'extensions'
  | 'disableAutoFullBuild'
  | 'includeAssetsImportedByServer'
  | 'baseAssets'
  | 'baseServer'
const globalConfigsDefinition: Record<GlobalConfigName, ConfigDefinition> = {
  onPrerenderStart: {
    env: 'server-only'
  },
  onBeforeRoute: {
    env: '_routing-env'
  },
  prerender: {
    env: 'config-only'
  },
  extensions: { env: 'config-only' },
  disableAutoFullBuild: { env: 'config-only' },
  includeAssetsImportedByServer: { env: 'config-only' },
  baseAssets: { env: 'config-only' },
  baseServer: { env: 'config-only' }
}

function getConfigData(
  userRootDir: string,
  isDev: boolean,
  invalidate: boolean,
  extensions: ExtensionResolved[]
): Promise<ConfigData> {
  let force = false
  if (invalidate) {
    assert([true, false].includes(isFirstInvalidation))
    if (isFirstInvalidation) {
      isFirstInvalidation = false
    } else {
      force = true
    }
  }
  if (!configDataPromise || force) {
    configDataPromise = loadConfigData(userRootDir, isDev, extensions)
  }
  return configDataPromise
}

async function loadInterfaceFiles(
  userRootDir: string,
  isDev: boolean,
  extensions: ExtensionResolved[]
): Promise<InterfaceFilesByLocationId> {
  const plusFiles = await findPlusFiles(userRootDir, isDev, extensions)
  const configFiles: UserFilePath[] = []
  const valueFiles: UserFilePath[] = []
  plusFiles.forEach((f) => {
    if (extractConfigName(f.filePathRelativeToUserRootDir) === 'config') {
      configFiles.push(f)
    } else {
      valueFiles.push(f)
    }
  })

  let interfaceFilesByLocationId: InterfaceFilesByLocationId = {}

  // Config files
  await Promise.all(
    configFiles.map(async ({ filePathAbsolute, filePathRelativeToUserRootDir }) => {
      const configFilePath = {
        filePathAbsolute: filePathAbsolute,
        filePathHumanReadable: filePathRelativeToUserRootDir
      }
      const { configFile, extendsConfigs } = await loadConfigFile(configFilePath, userRootDir)
      const interfaceFile = getInterfaceFileFromConfigFile(configFile, false)

      const locationId = getLocationId(filePathRelativeToUserRootDir)
      interfaceFilesByLocationId[locationId] = interfaceFilesByLocationId[locationId] ?? []
      interfaceFilesByLocationId[locationId]!.push(interfaceFile)
      extendsConfigs.forEach((extendsConfig) => {
        const interfaceFile = getInterfaceFileFromConfigFile(extendsConfig, true)
        interfaceFilesByLocationId[locationId]!.push(interfaceFile)
      })
    })
  )

  // Value files
  await Promise.all(
    valueFiles.map(async ({ filePathAbsolute, filePathRelativeToUserRootDir }) => {
      const configNameDefault = extractConfigName(filePathRelativeToUserRootDir)
      /* TODO
      assertConfigName(
        configNameDefault,
        [...Object.keys(configDefinitions), ...Object.keys(globalConfigsDefinition)],
      )
      */
      const interfaceFile: InterfaceFile = {
        filePathRelativeToUserRootDir,
        filePathAbsolute,
        configMap: {
          [configNameDefault]: {}
        },
        isConfigFile: false,
        isValueFile: true,
        configNameDefault
      }
      {
        const configDef = getConfigDef(configDefinitionsBuiltIn, configNameDefault)
        if (configDef?.env === 'config-only') {
          await loadValueFile(interfaceFile, configNameDefault)
        }
      }
      {
        const locationId = getLocationId(filePathRelativeToUserRootDir)
        interfaceFilesByLocationId[locationId] = interfaceFilesByLocationId[locationId] ?? []
        interfaceFilesByLocationId[locationId]!.push(interfaceFile)
      }
    })
  )

  return interfaceFilesByLocationId
}
function getConfigDef(
  configDefinitions: Record<string, ConfigDefinition>,
  configName: string
): null | ConfigDefinition {
  return configDefinitions[configName] ?? null
}
async function loadValueFile(interfaceValueFile: InterfaceValueFile, configNameDefault: string) {
  const { filePathAbsolute, filePathRelativeToUserRootDir } = interfaceValueFile
  const { fileExports } = await transpileAndLoadValueFile(filePathAbsolute)
  // TODO: skip warning for .mdx files
  assertDefaultExportUnknown(fileExports, filePathRelativeToUserRootDir)
  Object.entries(fileExports).forEach(([configName, configValue]) => {
    if (configName === 'default') {
      configName = configNameDefault
    }
    interfaceValueFile.configMap[configName] = { configValue }
  })
}
function getInterfaceFileFromConfigFile(configFile: ConfigFile, isConfigExtend: boolean): InterfaceFile {
  const { fileExports, filePathAbsolute, filePathHumanReadable, extendsFilePaths } = configFile
  const filePathRelativeToUserRootDir = filePathHumanReadable
  const interfaceFile: InterfaceFile = {
    filePathRelativeToUserRootDir,
    filePathAbsolute,
    configMap: {},
    isConfigFile: true,
    isValueFile: false,
    isConfigExtend,
    extendsFilePaths
  }
  const filePathToShowToUser = filePathRelativeToUserRootDir ?? filePathAbsolute
  assertDefaultExportObject(fileExports, filePathToShowToUser)
  Object.entries(fileExports.default).forEach(([configName, configValue]) => {
    interfaceFile.configMap[configName] = { configValue }
  })
  return interfaceFile
}

async function loadConfigData(
  userRootDir: string,
  isDev: boolean,
  extensions: ExtensionResolved[]
): Promise<ConfigData> {
  const interfaceFilesByLocationId = await loadInterfaceFiles(userRootDir, isDev, extensions)

  /* TODO
  if (plusConfigFile) {
    const configKeys = getConfigKeys(plusConfigFile)
    configKeys.forEach((configName) => {
      // TODO: this applies only against concrete config files, we should also apply to abstract config files
      // TODO: apply this as well against extendsConfigs
      assertConfigName(
        configName,
        [...Object.keys(configDefinitionsRelevant), 'meta'],
        plusConfigFile.plusConfigFilePath
      )
    })
  }
  */
  /*
  // TODO: remove this and instead ensure that configs are always defined globally
  plusValueFilesRelevant.forEach((plusValueFile) => {
    const { configName } = plusValueFile
    assert(configName in configDefinitionsRelevant || configName === 'meta')
  })
  */
  /* TODO
  const plusConfigFilesGlobal = getPlusConfigFilesGlobal(plusConfigFiles)
  plusConfigFiles.forEach((plusConfigFile) => {
    const { plusConfigFileExports, plusConfigFilePath } = plusConfigFile
    assertDefaultExportObject(plusConfigFileExports, plusConfigFilePath)
    Object.entries(plusConfigFileExports.default).forEach(([configName]) => {
      if (!isGlobal(configName)) return
      // TODO/v1: add links to docs further explaining why
      assertUsage(
        plusConfigFilesGlobal.includes(plusConfigFile),
        [
          `${plusConfigFilePath} defines the config '${configName}' which is global:`,
          plusConfigFilesGlobal.length
            ? `define '${configName}' in ${joinEnglish(
                plusConfigFilesGlobal.map((p) => p.plusConfigFilePath),
                'or'
              )} instead`
            : `create a global config (e.g. /pages/+config.js or /renderer/+config.js) and define '${configName}' there instead`
        ].join(' ')
      )
    })
  })
  */

  const { vikeConfig, pageConfigGlobal } = getGlobalConfigs(interfaceFilesByLocationId, userRootDir)

  const configFilesAll: Set<string> = new Set()
  const pageConfigsData: PageConfigData[] = await Promise.all(
    Object.entries(interfaceFilesByLocationId)
      .filter(([_pageId, interfaceFiles]) => isDefiningPage(interfaceFiles))
      .map(async ([locationId, interfaceFiles]) => {
        const routeFilesystem = getRouteFilesystem(locationId)
        const routeFilesystemDefinedBy = getRouteFilesystemDefinedBy(locationId)

        const interfaceFilesRelevant = getInterfaceFilesRelevant(interfaceFilesByLocationId, locationId)

        const configDefinitionsRelevant = getConfigDefinitions(interfaceFilesRelevant)

        // Load value files of custom config-only configs
        await Promise.all(
          getInterfaceFileList(interfaceFilesRelevant).map(async (interfaceFile) => {
            if (!interfaceFile.isValueFile) return
            const { configNameDefault } = interfaceFile
            if (getConfigDef(globalConfigsDefinition, configNameDefault)) return
            const configDef = getConfigDef(configDefinitionsRelevant, configNameDefault)
            assert(configDef, configNameDefault)
            if (configDef.env !== 'config-only') return
            const isAlreadyLoaded = interfacefileIsAlreaydLoaded(interfaceFile)
            if (isAlreadyLoaded) return
            // Value files for built-in confg-only configs should have already been loaded at loadInterfaceFiles()
            assert(!(configNameDefault in configDefinitionsBuiltIn))
            await loadValueFile(interfaceFile, configNameDefault)
          })
        )

        let configElements: PageConfigData['configElements'] = {}
        objectEntries(configDefinitionsRelevant)
          .filter(([configName]) => !isGlobal(configName))
          .forEach(([configName, configDef]) => {
            const configElement = resolveConfigElement(configName, configDef, interfaceFilesRelevant, userRootDir)
            if (!configElement) return
            configElements[configName as ConfigNameBuiltIn] = configElement
          })

        configElements = applyEffects(configElements, configDefinitionsRelevant)

        const isErrorPage = determineIsErrorPage(routeFilesystem)

        Object.entries(configElements).forEach(([_configName, configElement]) => {
          const { configEnv, codeFilePath } = configElement
          if (configEnv === 'config-only' && codeFilePath) {
            configFilesAll.add(codeFilePath)
          }
        })

        const entry: PageConfigData = {
          pageId: locationId,
          isErrorPage,
          routeFilesystemDefinedBy,
          routeFilesystem: isErrorPage ? null : routeFilesystem,
          configElements
        }
        return entry
      })
  )

  Object.values(interfaceFilesByLocationId).forEach((interfaceFiles) => {
    interfaceFiles.forEach((interfaceFile) => {
      if (interfaceFile.isConfigFile) {
        const { filePathRelativeToUserRootDir } = interfaceFile
        if (filePathRelativeToUserRootDir) {
          configFilesAll.add(filePathRelativeToUserRootDir)
        }
      }
    })
  })

  return { pageConfigsData, pageConfigGlobal, vikeConfig, configFilesAll }
}

function interfacefileIsAlreaydLoaded(interfaceFile: InterfaceFile): boolean {
  const configMapValues = Object.values(interfaceFile.configMap)
  const isAlreadyLoaded = configMapValues.some((conf) => 'configValue' in conf)
  if (isAlreadyLoaded) {
    assert(configMapValues.every((conf) => 'configValue' in conf))
  }
  return isAlreadyLoaded
}

function getInterfaceFilesRelevant(
  interfaceFilesByLocationId: InterfaceFilesByLocationId,
  locationIdPage: string
): InterfaceFilesByLocationId {
  const interfaceFilesRelevant = Object.fromEntries(
    Object.entries(interfaceFilesByLocationId)
      .filter(([locationId]) => {
        return isInherited(locationId, locationIdPage)
      })
      .sort(([locationId1], [locationId2]) => sortAfterInheritanceOrder(locationId1, locationId2, locationIdPage))
  )
  return interfaceFilesRelevant
}

function getInterfaceFileList(interfaceFilesByLocationId: InterfaceFilesByLocationId): InterfaceFile[] {
  const interfaceFiles: InterfaceFile[] = []
  Object.values(interfaceFilesByLocationId).forEach((interfaceFiles_) => {
    interfaceFiles.push(...interfaceFiles_)
  })
  return interfaceFiles
}

function getInterfaceFilesGloabl(interfaceFilesByLocationId: InterfaceFilesByLocationId): InterfaceFilesByLocationId {
  const interfaceFilesRelevant = Object.fromEntries(
    Object.entries(interfaceFilesByLocationId).filter(([locationId]) => {
      return isGlobalLocation(locationId)
    })
  )
  return interfaceFilesRelevant
}

function getGlobalConfigs(interfaceFilesByLocationId: InterfaceFilesByLocationId, userRootDir: string) {
  const vikeConfig: Record<string, unknown> = {}
  const pageConfigGlobal: PageConfigGlobalData = {
    onBeforeRoute: null,
    onPrerenderStart: null
  }

  const interfaceFilesGloabl = getInterfaceFilesGloabl(interfaceFilesByLocationId)

  objectEntries(globalConfigsDefinition).forEach(([configName, configDef]) => {
    const configElement = resolveConfigElement(configName, configDef, interfaceFilesGloabl, userRootDir)
    if (!configElement) return
    if (arrayIncludes(objectKeys(pageConfigGlobal), configName)) {
      assert(!('configValue' in configElement))
      pageConfigGlobal[configName] = configElement
    } else {
      assert('configValue' in configElement)
      if (configName === 'prerender' && typeof configElement.configValue === 'boolean') return
      assertWarning(
        false,
        `Being able to define config '${configName}' in ${configElement.configDefinedByFile} is experimental and will likely be removed. Define the config '${configName}' in vite-plugin-ssr's Vite plugin options instead.`,
        { onlyOnce: true, showStackTrace: false }
      )
      vikeConfig[configName] = configElement.configValue
    }
  })

  return { pageConfigGlobal, vikeConfig }
}

function resolveConfigElement(
  configName: string,
  configDef: ConfigDefinition,
  interfaceFilesRelevant: InterfaceFilesByLocationId,
  userRootDir: string
): null | ConfigElement {
  for (const interfaceFiles of Object.values(interfaceFilesRelevant)) {
    for (const interfaceFile of interfaceFiles) {
      const configFilePath = interfaceFile.filePathRelativeToUserRootDir ?? interfaceFile.filePathAbsolute
      const conf = interfaceFile.configMap[configName]
      if (conf) {
        const configEnv = configDef.env
        if (interfaceFile.isConfigFile) {
          assert('configValue' in conf)
          const { configValue } = conf
          const codeFile = getCodeFilePath(
            configValue,
            interfaceFile.filePathAbsolute,
            interfaceFile.filePathRelativeToUserRootDir,
            userRootDir
          )
          if (codeFile) {
            const { codeFilePath, codeFileExport } = codeFile
            const configElement = {
              plusConfigFilePath: configFilePath,
              codeFilePath,
              codeFileExport,
              configDefinedAt: `${codeFilePath} > \`export ${codeFileExport}\``,
              configDefinedByFile: codeFilePath,
              configEnv
            }
            return configElement
          } else {
            const configElement: ConfigElement = {
              plusConfigFilePath: configFilePath,
              configDefinedAt: `${configFilePath} > \`export default { ${configName} }\``,
              configDefinedByFile: configFilePath,
              codeFilePath: null,
              codeFileExport: null,
              configEnv,
              configValue
            }
            return configElement
          }
        } else if (interfaceFile.isValueFile) {
          const codeFilePath = interfaceFile.filePathRelativeToUserRootDir ?? interfaceFile.filePathAbsolute
          const codeFileExport = 'default'
          const configElement: ConfigElement = {
            configEnv,
            codeFilePath,
            codeFileExport,
            plusConfigFilePath: null,
            configDefinedAt: `${codeFilePath} > \`export ${codeFileExport}\``,
            configDefinedByFile: codeFilePath
          }
          if ('configValue' in conf) {
            configElement.configValue = conf.configValue
          } else {
            assert(configEnv !== 'config-only')
          }
          return configElement
        }
        assert(false)
      }
    }
  }
  /* TODO
        // Make this config value:
        //   /pages/some-page/+someConfig.js > `export default`
        // override that config value:
        //   /pages/some-page/+config > `export default { someConfig }`

        // Make overriding deterministic

      assertWarning(
        false,
        `${getCandidateDefinedAt(ignored, configName)} overriden by ${getCandidateDefinedAt(
          winnerNow,
          configName
        )}, remove one of the two`,
        { onlyOnce: false, showStackTrace: false }
      )
      */

  return null
}

function isDefiningPage(interfaceFiles: InterfaceFile[]): boolean {
  for (const interfaceFile of interfaceFiles) {
    const configNames = Object.keys(interfaceFile.configMap)
    if (configNames.some((configName) => isDefiningPageConfig(configName))) {
      return true
    }
  }
  return false
}
function isDefiningPageConfig(configName: string): boolean {
  return ['Page', 'route'].includes(configName)
}

function getCodeFilePath(
  configValue: unknown,
  configFilePathAbsolute: string,
  configFilePathRelativeToUserRootDir: string | null,
  userRootDir: string
): null | { codeFilePath: string; codeFileExport: string } {
  if (typeof configValue !== 'string') {
    return null
  }

  const importData = parseImportData(configValue)
  if (!importData) {
    /* TODO: remove? Do we need this for vike-* packages?
    const vitePath = getVitePathFromConfigValue(toPosixPath(configValue), plusConfigFilePath)
    codeFilePath = path.posix.join(userRootDir, vitePath)
    plusValueFileExport = 'default'
    */
    return null
  }
  const { importPath, importName } = importData

  const codeFileExport = importName
  let codeFilePath: string
  if (!importPath.startsWith('.')) {
    /* Path aliases, e.g.:
     * ```
     * // /renderer/+config.js
     * import onRenderClient from '#root/renderer/onRenderClient'
     * // ...
     * ```
     */
    codeFilePath = importPath
  } else {
    // Relative paths
    codeFilePath = resolveRelativeCodeFilePath(
      importPath,
      configFilePathAbsolute,
      configFilePathRelativeToUserRootDir,
      userRootDir
    )
  }

  return { codeFilePath, codeFileExport }
}

// We need to resolve relative paths into absolute paths. Because the import paths are included in virtual files:
// ```
// [vite] Internal server error: Failed to resolve import "./onPageTransitionHooks" from "virtual:vite-plugin-ssr:importPageCode:client:/pages/index". Does the file exist?
// ```
function resolveRelativeCodeFilePath(
  importPath: string,
  configFilePathAbsolute: string,
  configFilePathRelativeToUserRootDir: string | null,
  userRootDir: string
) {
  assertPosixPath(userRootDir)
  assertPosixPath(configFilePathAbsolute)
  let plusConfigFilDirPathAbsolute = path.posix.dirname(configFilePathAbsolute)
  const clean = addFileExtensionsToRequireResolve()
  let codeFilePath: string | null
  try {
    codeFilePath = require.resolve(importPath, { paths: [plusConfigFilDirPathAbsolute] })
  } catch {
    codeFilePath = null
  } finally {
    clean()
  }
  const configFilePathHumanReadable = configFilePathRelativeToUserRootDir ?? configFilePathAbsolute
  assert(configFilePathHumanReadable)
  assertUsage(
    codeFilePath,
    `${configFilePathHumanReadable} imports from '${importPath}' which points to a non-existing file`
  )
  codeFilePath = toPosixPath(codeFilePath)

  /* TODO: remove
    if (!importData) {
      assertCodeFilePathConfigValue(configValue, plusConfigFilePath, codeFilePath, fileExists, configName)
    }
    */

  // Make it a Vite path
  if (codeFilePath.startsWith(userRootDir)) {
    codeFilePath = getVitePathFromAbsolutePath(codeFilePath, userRootDir)
  } else {
    assertUsage(
      false,
      `${configFilePathHumanReadable} imports from a relative path '${importPath}' which is forbidden: import from a package.json#exports entry instead`
    )
    // None of the following works
    // /*
    // assert(codeFilePath.startsWith('/'))
    // codeFilePath = `/@fs${codeFilePath}`
    // /*/
    // codeFilePath = path.posix.relative(userRootDir, codeFilePath)
    // assert(codeFilePath.startsWith('../'))
    // codeFilePath = '/' + codeFilePath
    // //*/
  }

  assertPosixPath(codeFilePath)
  assert(codeFilePath.startsWith('/'))
  return codeFilePath
}

/* TODO: remove parts, and move others parts to replaceImportStatements.ts
function assertCodeFilePathConfigValue(
  configValue: string,
  plusConfigFilePath: string,
  codeFilePath: string,
  fileExists: boolean,
  configName: string
) {
  const errIntro = getErrorIntro(plusConfigFilePath, configName)
  const errIntro1 = `${errIntro} to the value '${configValue}'` as const
  const errIntro2 = `${errIntro1} but the value should be` as const
  const warnArgs = { onlyOnce: true, showStackTrace: false } as const

  assertUsage(fileExists, `${errIntro1} but a file wasn't found at ${codeFilePath}`)

  let configValueFixed = configValue

  if (!isPosixPath(configValueFixed)) {
    assert(configValueFixed.includes('\\'))
    configValueFixed = toPosixPath(configValueFixed)
    assert(!configValueFixed.includes('\\'))
    assertWarning(
      false,
      `${errIntro2} '${configValueFixed}' instead (replace backslashes '\\' with forward slahes '/')`,
      warnArgs
    )
  }

  if (configValueFixed.startsWith('/')) {
    const pageConfigDir = dirnameNormalized(plusConfigFilePath)
    assertWarning(
      false,
      `${errIntro2} a relative path instead (i.e. a path that starts with './' or '../') that is relative to ${pageConfigDir}`,
      warnArgs
    )
  } else if (!['./', '../'].some((prefix) => configValueFixed.startsWith(prefix))) {
    // It isn't possible to omit '../' so we can assume that the path is relative to pageConfigDir
    configValueFixed = './' + configValueFixed
    assertWarning(
      false,
      `${errIntro2} '${configValueFixed}' instead: make sure to prefix paths with './' (or '../')`,
      warnArgs
    )
  }
  {
    const filename = path.posix.basename(codeFilePath)
    configValueFixed = dirnameNormalized(configValueFixed) + filename
    const fileExt = path.posix.extname(filename)
    assertWarning(
      configValue.endsWith(filename),
      `${errIntro2} '${configValueFixed}' instead (don't omit the file extension '${fileExt}')`,
      warnArgs
    )
  }
}
*/

/*
function getVitePathFromConfigValue(codeFilePath: string, plusConfigFilePath: string): string {
  const pageConfigDir = dirnameNormalized(plusConfigFilePath)
  if (!codeFilePath.startsWith('/')) {
    assertPosixPath(codeFilePath)
    assertPosixPath(plusConfigFilePath)
    codeFilePath = path.posix.join(pageConfigDir, codeFilePath)
  }
  assert(codeFilePath.startsWith('/'))
  return codeFilePath
}
*/

function getVitePathFromAbsolutePath(filePathAbsolute: string, root: string): string {
  assertPosixPath(filePathAbsolute)
  assertPosixPath(root)
  assert(filePathAbsolute.startsWith(root))
  let vitePath = path.posix.relative(root, filePathAbsolute)
  assert(!vitePath.startsWith('/') && !vitePath.startsWith('.'))
  vitePath = '/' + vitePath
  return vitePath
}

/*
function dirnameNormalized(filePath: string) {
  assertPosixPath(filePath)
  let fileDir = path.posix.dirname(filePath)
  assert(!fileDir.endsWith('/'))
  fileDir = fileDir + '/'
  return fileDir
}
*/

function getConfigDefinitions(interfaceFilesRelevant: InterfaceFilesByLocationId): ConfigDefinitionsIncludingCustom {
  const configDefinitions: ConfigDefinitionsIncludingCustom = { ...configDefinitionsBuiltIn }
  Object.values(interfaceFilesRelevant).forEach((interfaceFiles) => {
    const configEntry = getConfigEntry('meta', interfaceFiles)
    if (!configEntry.configIsDefined) return
    assert('configValue' in configEntry)
    const metaVal = configEntry.configValue
    const { interfaceFile } = configEntry
    const definedByFile = interfaceFile.filePathRelativeToUserRootDir ?? interfaceFile.filePathAbsolute
    assertMetaValue(metaVal, definedByFile)
    objectEntries(metaVal).forEach(([configName, configDefinition]) => {
      // User can override an existing config definition
      const def = mergeConfigDefinition(
        configDefinitions[configName] as ConfigDefinition | undefined,
        configDefinition as ConfigDefinition
      )

      configDefinitions[configName] = def /* TODO: validate instead */ as any
    })
  })
  return configDefinitions
}

function getConfigEntry(
  configName: string,
  interfaceFiles: InterfaceFile[]
): { configIsDefined: true; configValue?: unknown; interfaceFile: InterfaceFile } | { configIsDefined: false } {
  const interfaceFilesForConfig = interfaceFiles.filter((interfaceFile) => configName in interfaceFile.configMap)
  if (interfaceFilesForConfig.length === 0) return { configIsDefined: false }
  const interfaceFile = interfaceFilesForConfig[0]!
  const val = interfaceFile.configMap[configName]
  assert(val)
  return { configIsDefined: true, interfaceFile, ...val }
}

function assertMetaValue(metaVal: unknown, definedByFile: string): asserts metaVal is Record<string, ConfigDefinition> {
  assertUsage(
    isObject(metaVal),
    `${definedByFile} sets the config 'meta' to a value with an invalid type \`${typeof metaVal}\`: it should be an object instead.`
  )
  objectEntries(metaVal).forEach(([configName, configDefinition]) => {
    assertUsage(
      isObject(configDefinition),
      `${definedByFile} sets 'meta.${configName}' to a value with an invalid type \`${typeof configDefinition}\`: it should be an object instead.`
    )
    // Validation
    /* TODO
    {
      {
        const prop = 'env'
        const hint = `Make sure to define the 'env' value of '${configName}' to 'client-only', 'server-only', or 'server-and-client'.`
        assertUsage(
          prop in def,
          `${plusConfigFilePath} doesn't define 'meta.${configName}.env' which is required. ${hint}`
        )
        assertUsage(
          hasProp(def, prop, 'string'),
          `${plusConfigFilePath} sets 'meta.${configName}.env' to a value with an invalid type ${typeof def.env}. ${hint}`
        )
        assertUsage(
          ['client-only', 'server-only', 'server-and-client'].includes(def.env),
          `${plusConfigFilePath} sets 'meta.${configName}.env' to an invalid value '${def.env}'. ${hint}`
        )
      }
    }
    */
  })
}

//function mergeConfigDefinition(def: ConfigDefinition, mods: Partial<ConfigDefinition>): ConfigDefinition
function mergeConfigDefinition(
  def: ConfigDefinition | undefined,
  mods: Partial<ConfigDefinition>
): Partial<ConfigDefinition>
function mergeConfigDefinition(
  def: ConfigDefinition | undefined,
  mods: Partial<ConfigDefinition>
): Partial<ConfigDefinition> {
  return {
    ...def,
    ...mods
  }
}

type ConfigElements = Record<string, ConfigElement>

function applyEffects(
  configElements: ConfigElements,
  configDefinitionsRelevant: ConfigDefinitionsIncludingCustom
): ConfigElements {
  const configElementsMod = { ...configElements }

  objectEntries(configDefinitionsRelevant).forEach(([configName, configDef]) => {
    if (!configDef.effect) return
    assertUsage(configDef.env === 'config-only', 'TODO')
    const configElementEffect = configElements[configName]
    if (!configElementEffect) return
    assert('configValue' in configElementEffect)
    const { configValue, configDefinedAt } = configElementEffect
    const configMod = configDef.effect({
      configValue,
      configDefinedAt
    })
    if (!configMod) return
    objectEntries(configMod).forEach(([configName, configModValue]) => {
      if (configName === 'meta') {
        assertUsage(isObject(configModValue), 'TODO')
        objectEntries(configModValue).forEach(([configTargetName, configTargetModValue]) => {
          assertUsage(isObject(configTargetModValue), 'TODO')
          assertUsage(Object.keys(configTargetModValue).length === 1, 'TODO')
          assertUsage(hasProp(configTargetModValue, 'env', 'string'), 'TODO')
          const configEnv = configTargetModValue.env as ConfigEnv // TODO: proper validation
          configElementsMod[configTargetName]!.configEnv = configEnv
        })
      } else {
        assertConfigName(configName, Object.keys(configDefinitionsRelevant), `effect of TODO`)
        const configElementTargetOld = configElementsMod[configName]
        assert(configElementTargetOld)
        configElementsMod[configName] = {
          // TODO-begin
          ...configElementEffect,
          configDefinedAt: `${configElementEffect.configDefinedAt} (side-effect)`,
          // TODO-end
          configEnv: configElementTargetOld.configEnv,
          configValue: configModValue
        }
      }
    })
  })

  return configElementsMod
}

async function findPlusFiles(userRootDir: string, isDev: boolean, extensions: ExtensionResolved[]) {
  const plusFiles = await findUserFiles('**/+*', userRootDir, isDev)
  extensions.forEach((extension) => {
    extension.pageConfigsDistFiles?.forEach((pageConfigDistFile) => {
      // TODO/v1-release: remove
      if (!pageConfigDistFile.importPath.includes('+')) return
      assert(pageConfigDistFile.importPath.includes('+'))
      assert(path.posix.basename(pageConfigDistFile.importPath).startsWith('+'))
      const { importPath, filePath } = pageConfigDistFile
      plusFiles.push({
        filePathRelativeToUserRootDir: importPath,
        filePathAbsolute: filePath
      })
    })
  })
  return plusFiles
}

function extractConfigName(filePath: string) {
  assertPosixPath(filePath)
  const basename = path.posix.basename(filePath).split('.')[0]!
  assert(basename.startsWith('+'))
  const configName = basename.slice(1)
  return configName
}

type ConfigFile = {
  fileExports: Record<string, unknown>
  filePathAbsolute: string
  // TODO: rename to filePathRelativeToUserRootDir?
  filePathHumanReadable: null | string
  extendsFilePaths: string[]
}

async function loadConfigFile(
  configFilePath: FilePath,
  userRootDir: string
): Promise<{ configFile: ConfigFile; extendsConfigs: ConfigFile[] }> {
  const { filePathAbsolute, filePathHumanReadable } = configFilePath
  const { fileExports } = await transpileAndLoadConfigFile(filePathAbsolute, filePathHumanReadable)
  const { extendsConfigs, extendsFilePaths } = await loadExtendsConfigs(fileExports, configFilePath, userRootDir)

  const configFile: ConfigFile = {
    fileExports,
    filePathHumanReadable,
    filePathAbsolute,
    extendsFilePaths
  }
  return { configFile, extendsConfigs }
}

// TODO: avoid infinite loop
async function loadExtendsConfigs(
  configFileExports: Record<string, unknown>,
  configFilePath: FilePath,
  userRootDir: string
) {
  const extendsImportData = getExtendsImportData(configFileExports, configFilePath)
  const extendsConfigFiles: FilePath[] = []
  extendsImportData.map((importData) => {
    const { importPath } = importData
    // TODO
    //  - error handling if path doesn't exist
    //  - validate extends configs
    let filePathAbsolute = require.resolve(importPath, { paths: [configFilePath.filePathAbsolute] })
    filePathAbsolute = toPosixPath(filePathAbsolute)
    assertExtendsImportPath(importPath, filePathAbsolute, configFilePath)
    extendsConfigFiles.push({
      filePathAbsolute,
      // - filePathRelativeToUserRootDir has no functionality beyond nicer error messages for user
      // - Using importPath would be visually nicer but it's ambigous => we rather pick filePathAbsolute for added clarity
      filePathHumanReadable: determineFilePathHumanReadable(filePathAbsolute, userRootDir)
    })
  })

  const extendsConfigs: ConfigFile[] = []
  await Promise.all(
    extendsConfigFiles.map(async (configFilePath) => {
      const result = await loadConfigFile(configFilePath, userRootDir)
      extendsConfigs.push(result.configFile)
      extendsConfigs.push(...result.extendsConfigs)
    })
  )

  const extendsFilePaths = extendsConfigFiles.map((f) => f.filePathAbsolute)

  return { extendsConfigs, extendsFilePaths }
}

function determineFilePathHumanReadable(filePathAbsolute: string, userRootDir: string): null | string {
  assertPosixPath(filePathAbsolute)
  assertPosixPath(userRootDir)
  if (!filePathAbsolute.startsWith(userRootDir)) {
    return null
  }
  let filePathHumanReadable = filePathAbsolute.slice(userRootDir.length)
  if (!filePathHumanReadable.startsWith('/')) filePathHumanReadable = '/' + filePathHumanReadable
  return filePathHumanReadable
}

function assertExtendsImportPath(importPath: string, filePath: string, configFilePath: FilePath) {
  if (isNpmPackageModule(importPath)) {
    const fileDir = path.posix.dirname(filePath) + '/'
    const fileName = path.posix.basename(filePath)
    const fileNameBaseCorrect = '+config'
    const [fileNameBase, ...fileNameRest] = fileName.split('.')
    const fileNameCorrect = [fileNameBaseCorrect, ...fileNameRest].join('.')
    assertWarning(fileNameBase === fileNameBaseCorrect, `Rename ${fileName} to ${fileNameCorrect} in ${fileDir}`, {
      onlyOnce: true,
      showStackTrace: false
    })
  } else {
    assertWarning(
      false,
      `${getFilePathToPrint(
        configFilePath
      )} uses 'extends' to inherit from '${importPath}' which is a user-land file: this is experimental and may be remove at any time. Reach out to a maintainer if you need this feature.`,
      { onlyOnce: true, showStackTrace: false }
    )
  }
}

function getFilePathToPrint(filePath: FilePath) {
  const filePathToPrint = filePath.filePathHumanReadable ?? filePath.filePathAbsolute
  assert(filePathToPrint)
  return filePathToPrint
}

function getExtendsImportData(configFileExports: Record<string, unknown>, configFilePath: FilePath): ImportData[] {
  const configFilePathToPrint = getFilePathToPrint(configFilePath)
  assertDefaultExportObject(configFileExports, configFilePathToPrint)
  const configValues = configFileExports.default
  if (!configValues.extends) {
    return []
  }
  assertUsage(hasProp(configValues, 'extends', 'string[]'), 'TODO')
  const extendsImportData = configValues.extends.map((importDataSerialized) => {
    const importData = parseImportData(importDataSerialized)
    assertUsage(importData, 'TODO')
    return importData
  })
  return extendsImportData
}

type UserFilePath = {
  filePathAbsolute: string
  filePathRelativeToUserRootDir: string
}
type FilePath = {
  filePathAbsolute: string
  filePathHumanReadable: null | string
}

async function findUserFiles(pattern: string | string[], userRootDir: string, isDev: boolean): Promise<UserFilePath[]> {
  assertPosixPath(userRootDir)
  const timeBase = new Date().getTime()
  const result = await glob(pattern, {
    ignore: ['**/node_modules/**'],
    cwd: userRootDir,
    dot: false
  })
  const time = new Date().getTime() - timeBase
  if (isDev) {
    // We only warn in dev, because while building it's expected to take a long time as fast-glob is competing for resources with other tasks
    assertWarning(
      time < 2 * 1000,
      `Crawling your user files took an unexpected long time (${time}ms). Create a new issue on vite-plugin-ssr's GitHub.`,
      {
        showStackTrace: false,
        onlyOnce: 'slow-page-files-search'
      }
    )
  }
  const userFiles = result.map((p) => {
    p = toPosixPath(p)
    const filePathRelativeToUserRootDir = path.posix.join('/', p)
    const filePathAbsolute = path.posix.join(userRootDir, p)
    return { filePathRelativeToUserRootDir, filePathAbsolute }
  })
  return userFiles
}

// TODO: re-use this
function handleUserFileError(err: unknown, isDev: boolean) {
  // Properly handle error during transpilation so that we can use assertUsage() during transpilation
  if (isDev) {
    throw err
  } else {
    // Avoid ugly error format:
    // ```
    // [vite-plugin-ssr:importUserCode] Could not load virtual:vite-plugin-ssr:importUserCode:server: [vite-plugin-ssr@0.4.70][Wrong Usage] /pages/+config.ts sets the config 'onRenderHtml' to the value './+config/onRenderHtml-i-dont-exist.js' but no file was found at /home/rom/code/vite-plugin-ssr/examples/v1/pages/+config/onRenderHtml-i-dont-exist.js
    // Error: [vite-plugin-ssr@0.4.70][Wrong Usage] /pages/+config.ts sets the config 'onRenderHtml' to the value './+config/onRenderHtml-i-dont-exist.js' but no file was found at /home/rom/code/vite-plugin-ssr/examples/v1/pages/+config/onRenderHtml-i-dont-exist.js
    //     at ...
    //     at ...
    //     at ...
    //     at ...
    //     at ...
    //     at ...
    //   code: 'PLUGIN_ERROR',
    //   plugin: 'vite-plugin-ssr:importUserCode',
    //   hook: 'load',
    //   watchFiles: [
    //     '/home/rom/code/vite-plugin-ssr/vite-plugin-ssr/dist/cjs/node/importBuild.js',
    //     '\x00virtual:vite-plugin-ssr:importUserCode:server'
    //   ]
    // }
    //  ELIFECYCLE  Command failed with exit code 1.
    // ```
    console.log('')
    console.error(err)
    process.exit(1)
  }
}

function isGlobal(configName: string): configName is GlobalConfigName {
  if (configName === 'prerender') return false
  const configNamesGlobal = Object.keys(globalConfigsDefinition)
  return arrayIncludes(configNamesGlobal, configName)
}

function assertConfigName(configName: string, configNames: string[], definedBy: string) {
  if (configNames.includes(configName)) return
  let errMsg = `${definedBy} defines an unknown config '${configName}'`
  const configNameSimilar = getMostSimilar(configName, configNames)
  if (configNameSimilar) {
    assert(configNameSimilar !== configName)
    errMsg = `${errMsg}, did you mean to define '${configNameSimilar}' instead?`
  }
  assertUsage(false, errMsg)
}

function determineIsErrorPage(routeFilesystem: string) {
  assertPosixPath(routeFilesystem)
  return routeFilesystem.split('/').includes('_error')
}
