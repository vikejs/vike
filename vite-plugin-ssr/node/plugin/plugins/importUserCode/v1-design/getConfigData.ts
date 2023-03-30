export { getConfigData }

import {
  assertPosixPath,
  assert,
  isObject,
  assertUsage,
  isPosixPath,
  toPosixPath,
  assertWarning,
  addFileExtensionsToRequireResolve,
  assertDefaultExportUnknown,
  assertDefaultExportObject,
  objectEntries,
  objectAssign,
  hasProp,
  arrayIncludes,
  objectKeys,
  assertIsVitePluginCode,
  getMostSimilar,
  isNpmPackageImportPath,
  getNpmPackageImportPath
} from '../../../utils'
import path from 'path'
import type {
  ConfigName,
  ConfigElement,
  ConfigEnv,
  PageConfigData,
  PageConfigGlobalData
} from '../../../../../shared/page-configs/PageConfig'
import { configDefinitionsBuiltIn, type ConfigDefinition } from './getConfigData/configDefinitionsBuiltIn'
import glob from 'fast-glob'
import type { ExtensionResolved } from '../../../../../shared/ConfigVps'
import { determineRouteFromFilesystemPath } from './getConfigData/determineRouteFromFilesystemPath'
import { determinePageId } from './getConfigData/determinePageId'
import { transpileAndLoadPageConfig, transpileAndLoadConfigValueFile } from './transpileAndLoadPlusFile'
import { isImportMacro, parseImportMacro } from './replaceImportStatements'

assertIsVitePluginCode()

type ConfigData = {
  pageConfigsData: PageConfigData[]
  pageConfigGlobal: PageConfigGlobalData
  vikeConfig: Record<string, unknown>
  vikeConfigFilePath: string | null
}
let configDataPromise: Promise<ConfigData> | null = null
let isFirstInvalidation = true

type ConfigDefinitionsExtended = Record<string, ConfigDefinition>

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
    c_code: true,
    env: 'server-only'
  },
  onBeforeRoute: {
    c_code: true,
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

async function loadConfigData(
  userRootDir: string,
  isDev: boolean,
  extensions: ExtensionResolved[]
): Promise<ConfigData> {
  const plusFiles = await findPlusFiles(userRootDir, isDev, extensions)

  const result = await findAndLoadPageConfigFiles(plusFiles)
  /* TODO: - remove this if we don't need this for optimizeDeps.entries
   *       - also remove whole result.err try-catch mechanism, just let esbuild throw instead
  if ('err' in result) {
    return ['export const pageConfigs = null;', 'export const pageConfigGlobal = null;'].join('\n')
  }
  */
  if ('err' in result) {
    handleBuildError(result.err, isDev)
    assert(false)
  }
  const { pageConfigFiles } = result

  let configValueFiles: ConfigValueFile[]
  {
    const configDefinitions = getConfigDefinitions(pageConfigFiles)
    configValueFiles = await findAndLoadConfigValueFiles(plusFiles, configDefinitions)
  }

  const vikeConfig: Record<string, unknown> = {}
  let vikeConfigFilePath: string | null = null
  const pageConfigGlobal: PageConfigGlobalData = {
    onBeforeRoute: null,
    onPrerenderStart: null
  }
  {
    const pageConfigFileGlobal = getPageConfigGlobal(pageConfigFiles)
    if (pageConfigFileGlobal) {
      vikeConfigFilePath = pageConfigFileGlobal.pageConfigFilePath
    }
    pageConfigFiles.forEach((pageConfigFile) => {
      const { pageConfigFileExports, pageConfigFilePath } = pageConfigFile
      assertDefaultExportObject(pageConfigFileExports, pageConfigFilePath)
      Object.entries(pageConfigFileExports.default).forEach(([configName]) => {
        if (!isGlobal(configName)) return
        // TODO/v1: add links to docs further explaining why
        assertUsage(
          pageConfigFile === pageConfigFileGlobal,
          [
            `${pageConfigFilePath} defines the config '${configName}' which is global: `,
            pageConfigFileGlobal
              ? `define '${configName}' in ${pageConfigFileGlobal.pageConfigFilePath} instead `
              : `create a global config (e.g. /pages/+config.js) and define '${configName}' there instead`
          ].join(' ')
        )
      })
    })
    const configValueFilesRelevant = configValueFiles.filter((c) => {
      // TODO: assert that there should be only one
      // TODO: assert filesystem location
      return isGlobal(c.configName)
    })
    objectEntries(globalConfigsDefinition).forEach(([configName, configDef]) => {
      const configElement = resolveConfigElement(
        configName,
        configDef,
        pageConfigFileGlobal ? [pageConfigFileGlobal] : [],
        userRootDir,
        configValueFilesRelevant
      )
      if (!configElement) return
      if (arrayIncludes(objectKeys(pageConfigGlobal), configName)) {
        assert(!('configValue' in configElement))
        pageConfigGlobal[configName] = configElement
      } else {
        assert('configValue' in configElement)
        vikeConfig[configName] = configElement.configValue
      }
    })
  }

  const pageIds = determinePageIds(pageConfigFiles, configValueFiles)

  const pageConfigsData: PageConfigData[] = []
  pageIds.forEach(({ pageId, routeFilesystem, pageConfigFile, routeFilesystemDefinedBy }) => {
    const pageConfigFilesRelevant = pageConfigFiles.filter(({ pageConfigFilePath }) =>
      isRelevantConfigPath(pageConfigFilePath, pageId)
    )
    const configValueFilesRelevant = configValueFiles
      .filter(({ configValueFilePath }) => isRelevantConfigPath(configValueFilePath, pageId))
      .filter((configValueFile) => !isGlobal(configValueFile.configName))
    let configDefinitionsRelevant = getConfigDefinitions(pageConfigFilesRelevant)

    if (pageConfigFile) {
      const pageConfigValues = getPageConfigValues(pageConfigFile)
      Object.keys(pageConfigValues).forEach((configName) => {
        // TODO: this applies only against concrete config files, we should also apply to abstract config files
        assertConfigName(
          configName,
          [...Object.keys(configDefinitionsRelevant), 'meta'],
          pageConfigFile.pageConfigFilePath
        )
      })
    }

    // TODO: remove this and instead ensure that configs are always defined globally
    configValueFilesRelevant.forEach((configValueFile) => {
      const { configName } = configValueFile
      assert(configName in configDefinitionsRelevant || configName === 'meta')
    })

    let configElements: PageConfigData['configElements'] = {}
    objectEntries(configDefinitionsRelevant).forEach(([configName, configDef]) => {
      const configElement = resolveConfigElement(
        configName,
        configDef,
        pageConfigFilesRelevant,
        userRootDir,
        configValueFilesRelevant
      )
      if (!configElement) return
      configElements[configName as ConfigName] = configElement
    })

    configElements = applyEffects(configElements, configDefinitionsRelevant)

    const isErrorPage: boolean = !!configElements.isErrorPage?.configValue

    pageConfigsData.push({
      pageId,
      isErrorPage,
      routeFilesystemDefinedBy,
      pageConfigFilePathAll: pageConfigFilesRelevant.map((p) => p.pageConfigFilePath),
      routeFilesystem: isErrorPage ? null : routeFilesystem,
      configElements
    })
  })

  return { pageConfigsData, pageConfigGlobal, vikeConfig, vikeConfigFilePath }
}

function determinePageIds(pageConfigFiles: PageConfigFile[], configValueFiles: ConfigValueFile[]) {
  const pageIds: {
    pageId: string
    routeFilesystem: string
    pageConfigFile: null | PageConfigFile
    routeFilesystemDefinedBy: string
  }[] = []
  pageConfigFiles
    .filter((p) => isDefiningPage(p))
    .forEach((pageConfigFile) => {
      const { pageConfigFilePath } = pageConfigFile
      const pageId = determinePageId(pageConfigFilePath)
      const routeFilesystem = determineRouteFromFilesystemPath(pageConfigFilePath)
      pageIds.push({
        pageId,
        routeFilesystem,
        pageConfigFile,
        routeFilesystemDefinedBy: pageConfigFilePath
      })
    })
  configValueFiles.map((configValueFile) => {
    if (!isConfigDefiningPage(configValueFile.configName)) return
    const { configValueFilePath } = configValueFile
    const pageId = determinePageId(configValueFilePath)
    const routeFilesystem = determineRouteFromFilesystemPath(configValueFilePath)
    assertPosixPath(configValueFilePath)
    const routeFilesystemDefinedBy = path.posix.dirname(configValueFilePath) + '/'
    assert(!routeFilesystemDefinedBy.endsWith('//'))
    {
      const alreadyIncluded = pageIds.some((p) => {
        if (p.pageId === pageId) {
          assert(p.routeFilesystem === routeFilesystem)
          return true
        }
        return false
      })
      if (alreadyIncluded) return
    }
    pageIds.push({
      pageId,
      routeFilesystem,
      pageConfigFile: null,
      routeFilesystemDefinedBy
    })
  })
  return pageIds
}

function resolveConfigElement(
  configName: string,
  configDef: ConfigDefinition,
  pageConfigFilesRelevant: PageConfigFile[],
  userRootDir: string,
  configValueFilesRelevant: ConfigValueFile[]
): null | ConfigElement {
  // TODO: implement warning if defined in non-abstract +config.js as well as in +{configName}.js

  {
    const configValueFiles = configValueFilesRelevant.filter(
      (configValueFile) => configValueFile.configName === configName
    )
    if (configValueFiles.length !== 0) {
      assert(configValueFiles.length === 1)
      const configValueFile = configValueFiles[0]!
      const { configValueFilePath } = configValueFile
      const configValueFileExport = 'default'
      const configElement: ConfigElement = {
        configEnv: configDef.env,
        // TODO: rename configValueFilePath to configValueFilePath?
        configValueFilePath: configValueFilePath,
        configValueFileExport,
        pageConfigFilePath: null,
        configSrc: `${configValueFilePath} > \`export ${configValueFileExport}\``,
        configDefinedByFile: configValueFilePath
      }
      if ('configValue' in configValueFile) {
        configElement.configValue = configValueFile.configValue
      }
      return configElement
    }
  }

  const result = getConfigValue(configName, pageConfigFilesRelevant)
  if (!result) return null
  const { pageConfigValue, pageConfigValueFilePath } = result
  const configValue = pageConfigValue
  const configFilePath = pageConfigValueFilePath
  const { c_code, c_validate } = configDef
  const codeFile = getCodeFilePath(pageConfigValue, pageConfigValueFilePath, userRootDir, configName, c_code)
  assert(codeFile || !c_code) // TODO: assertUsage() or remove
  if (c_validate) {
    const commonArgs = { configFilePath }
    if (codeFile) {
      assert(typeof configValue === 'string')
      const { codeFilePath } = codeFile
      c_validate({ configValue, codeFilePath, ...commonArgs })
    } else {
      c_validate({ configValue, ...commonArgs })
    }
  }
  const { env } = configDef
  if (!codeFile) {
    return {
      pageConfigFilePath: configFilePath,
      configSrc: `${configFilePath} > ${configName}`,
      configDefinedByFile: configFilePath,
      configValueFilePath: null,
      configValueFileExport: null,
      configEnv: env,
      configValue
    }
  } else {
    assertUsage(
      typeof configValue === 'string',
      `${getErrorIntro(
        configFilePath,
        configName
      )} to a value with a wrong type \`${typeof configValue}\`: it should be a string instead`
    )
    const { codeFilePath, configValueFileExport } = codeFile
    return {
      pageConfigFilePath: configFilePath,
      configValueFilePath: codeFilePath,
      configValueFileExport,
      configSrc: `${codeFilePath} > \`export ${configValueFileExport}\``,
      configDefinedByFile: codeFilePath,
      configEnv: env
    }
  }
}

function isDefiningPage(pageConfigFile: PageConfigFile): boolean {
  const pageConfigValues = getPageConfigValues(pageConfigFile)
  return Object.keys(pageConfigValues).some((configName) => isConfigDefiningPage(configName))
}
function isConfigDefiningPage(configName: string): boolean {
  return ['Page', 'route', 'isErrorPage'].includes(configName)
}

function getCodeFilePath(
  configValue: unknown,
  pageConfigFilePath: string,
  userRootDir: string,
  configName: string,
  enforce: undefined | boolean
): null | { codeFilePath: string; configValueFileExport: string } {
  if (typeof configValue !== 'string') {
    assertUsage(
      !enforce,
      `${getErrorIntro(
        pageConfigFilePath,
        configName
      )} to a value with an invalid type \`${typeof configValue}\` but it should be a \`string\` instead`
    )
    return null
  }

  const isMacro = isImportMacro(configValue)

  let codeFilePath: string
  let configValueFileExport: string
  if (isMacro) {
    const { importPath, importName } = parseImportMacro(configValue)
    codeFilePath = path.posix.join(userRootDir, path.posix.dirname(pageConfigFilePath), toPosixPath(importPath))
    configValueFileExport = importName
  } else {
    // TODO: remove
    const vitePath = getVitePathFromConfigValue(toPosixPath(configValue), pageConfigFilePath)
    codeFilePath = path.posix.join(userRootDir, vitePath)
    configValueFileExport = 'default'
  }
  assertPosixPath(userRootDir)
  assertPosixPath(codeFilePath)
  const clean = addFileExtensionsToRequireResolve()
  let fileExists: boolean
  try {
    codeFilePath = require.resolve(codeFilePath)
    fileExists = true
  } catch {
    fileExists = false
  } finally {
    clean()
  }
  codeFilePath = toPosixPath(codeFilePath)

  if (!enforce && !fileExists) return null

  // TODO: remove
  if (!isMacro) {
    assertCodeFilePathConfigValue(configValue, pageConfigFilePath, codeFilePath, fileExists, configName)
  }

  // Make relative to userRootDir
  codeFilePath = getVitePathFromAbsolutePath(codeFilePath, userRootDir)

  assert(fileExists)
  assertPosixPath(codeFilePath)
  assert(codeFilePath.startsWith('/'))
  return { codeFilePath, configValueFileExport }
}

function assertCodeFilePathConfigValue(
  configValue: string,
  pageConfigFilePath: string,
  codeFilePath: string,
  fileExists: boolean,
  configName: string
) {
  const errIntro = getErrorIntro(pageConfigFilePath, configName)
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
    const pageConfigDir = dirnameNormalized(pageConfigFilePath)
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

function getVitePathFromConfigValue(codeFilePath: string, pageConfigFilePath: string): string {
  const pageConfigDir = dirnameNormalized(pageConfigFilePath)
  if (!codeFilePath.startsWith('/')) {
    assertPosixPath(codeFilePath)
    assertPosixPath(pageConfigFilePath)
    codeFilePath = path.posix.join(pageConfigDir, codeFilePath)
  }
  assert(codeFilePath.startsWith('/'))
  return codeFilePath
}

function getVitePathFromAbsolutePath(filePathAbsolute: string, root: string): string {
  assertPosixPath(filePathAbsolute)
  assertPosixPath(root)
  assert(filePathAbsolute.startsWith(root))
  let vitePath = path.posix.relative(root, filePathAbsolute)
  assert(!vitePath.startsWith('/') && !vitePath.startsWith('.'))
  vitePath = '/' + vitePath
  return vitePath
}

function dirnameNormalized(filePath: string) {
  assertPosixPath(filePath)
  let fileDir = path.posix.dirname(filePath)
  assert(!fileDir.endsWith('/'))
  fileDir = fileDir + '/'
  return fileDir
}

function getErrorIntro(filePath: string, configName: string): string {
  assert(filePath.startsWith('/') || isNpmPackageImportPath(filePath))
  assert(!configName.startsWith('/'))
  return `${filePath} sets the config ${configName}`
}

function getConfigValue(
  pageConfigName: string,
  pageConfigFilesRelevant: PageConfigFile[]
): null | { pageConfigValueFilePath: string; pageConfigValue: unknown } {
  for (const configFile of pageConfigFilesRelevant) {
    const pageConfigValues = getPageConfigValues(configFile)
    const pageConfigValue = pageConfigValues[pageConfigName]
    if (pageConfigValue !== undefined) {
      return { pageConfigValueFilePath: configFile.pageConfigFilePath, pageConfigValue }
    }
  }
  return null
}

function getPageConfigValues(pageConfigFile: PageConfigFile): Record<string, unknown> {
  const { pageConfigFilePath, pageConfigFileExports } = pageConfigFile
  assertDefaultExportObject(pageConfigFileExports, pageConfigFilePath)
  const pageConfigValues = pageConfigFileExports.default
  return pageConfigValues
}

function getConfigDefinitions(pageConfigFilesRelevant: PageConfigFile[]): ConfigDefinitionsExtended {
  const configDefinitions: ConfigDefinitionsExtended = { ...configDefinitionsBuiltIn }
  pageConfigFilesRelevant.forEach((pageConfigFile) => {
    const { pageConfigFilePath } = pageConfigFile
    const { meta } = getPageConfigValues(pageConfigFile)
    if (meta) {
      assertUsage(
        isObject(meta),
        `${pageConfigFilePath} sets the config 'meta' to a value with an invalid type \`${typeof meta}\`: it should be an object instead.`
      )
      objectEntries(meta).forEach(([configName, configDefinition]) => {
        assertUsage(
          isObject(configDefinition),
          `${pageConfigFilePath} sets 'meta.${configName}' to a value with an invalid type \`${typeof configDefinition}\`: it should be an object instead.`
        )

        // User can override an existing config definition
        const def = mergeConfigDefinition(
          configDefinitions[configName] as ConfigDefinition | undefined,
          configDefinition as ConfigDefinition
        )

        // Validation
        /* TODO
        {
          {
            const prop = 'env'
            const hint = `Make sure to define the 'env' value of '${configName}' to 'client-only', 'server-only', or 'server-and-client'.`
            assertUsage(
              prop in def,
              `${pageConfigFilePath} doesn't define 'meta.${configName}.env' which is required. ${hint}`
            )
            assertUsage(
              hasProp(def, prop, 'string'),
              `${pageConfigFilePath} sets 'meta.${configName}.env' to a value with an invalid type ${typeof def.env}. ${hint}`
            )
            assertUsage(
              ['client-only', 'server-only', 'server-and-client'].includes(def.env),
              `${pageConfigFilePath} sets 'meta.${configName}.env' to an invalid value '${def.env}'. ${hint}`
            )
          }
        }
        */

        configDefinitions[configName] = def /* TODO: validate instead */ as any
      })
    }
  })
  return configDefinitions
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
  configDefinitionsRelevant: ConfigDefinitionsExtended
): ConfigElements {
  const configElementsMod = { ...configElements }

  objectEntries(configDefinitionsRelevant).forEach(([configName, configDef]) => {
    if (!configDef.effect) return
    assertUsage(configDef.env === 'config-only', 'TODO')
    const configElementEffect = configElements[configName]
    if (!configElementEffect) return
    assert('configValue' in configElementEffect)
    const { configValue, configDefinedByFile } = configElementEffect
    const configMod = configDef.effect({
      configValue,
      configDefinedAt: configDefinedByFile // TODO: align naming
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
          configSrc: `${configElementEffect} (side-effect)`,
          // TODO-end
          configEnv: configElementTargetOld.configEnv,
          configValue: configModValue
        }
      }
    })
  })

  return configElementsMod
}

type PageConfigFile = {
  pageConfigFilePath: string
  pageConfigFileExports: Record<string, unknown>
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

type ConfigValueFile = {
  pageId: string
  configName: string
  configValueFilePath: string
  configValue?: unknown
}
async function findAndLoadConfigValueFiles(
  plusFiles: FoundFile[],
  configDefinitions: ConfigDefinitionsExtended
): Promise<ConfigValueFile[]> {
  const configValueFiles: ConfigValueFile[] = await Promise.all(
    plusFiles
      .filter((f) => extractConfigName(f.filePathRelativeToUserRootDir) !== 'config')
      .map((f) => loadConfigValueFile(f, configDefinitions))
  )
  return configValueFiles
}

async function loadConfigValueFile(plusFile: FoundFile, configDefinitions: ConfigDefinitionsExtended) {
  const { filePathAbsolute, filePathRelativeToUserRootDir } = plusFile
  const configName = extractConfigName(filePathRelativeToUserRootDir)
  assertConfigName(
    configName,
    [...Object.keys(configDefinitions), ...Object.keys(globalConfigsDefinition)],
    filePathRelativeToUserRootDir
  )
  const configDef =
    configDefinitions[configName] ?? (globalConfigsDefinition as Record<string, ConfigDefinition>)[configName]
  assert(configDef)
  const configValueFile: ConfigValueFile = {
    configName,
    pageId: determinePageId(filePathRelativeToUserRootDir),
    configValueFilePath: filePathRelativeToUserRootDir
  }
  if (configDef.env !== 'config-only') {
    return configValueFile
  }
  const result = await transpileAndLoadConfigValueFile(filePathAbsolute)
  if ('err' in result) {
    throw result.err
  }
  const fileExports = result.exports
  assertDefaultExportUnknown(fileExports, filePathRelativeToUserRootDir)
  const configValue = fileExports.default
  objectAssign(configValueFile, { configValue })
  return configValueFile
}

function extractConfigName(filePath: string) {
  assertPosixPath(filePath)
  const basename = path.posix.basename(filePath).split('.')[0]!
  assert(basename.startsWith('+'))
  const configName = basename.slice(1)
  return configName
}

async function findAndLoadPageConfigFiles(
  plusFiles: FoundFile[]
): Promise<{ err: unknown } | { pageConfigFiles: PageConfigFile[] }> {
  const pageConfigFiles: PageConfigFile[] = []
  // TODO: make esbuild build everyting at once
  const results = await Promise.all(
    plusFiles
      .filter((f) => extractConfigName(f.filePathRelativeToUserRootDir) === 'config')
      .map(async ({ filePathAbsolute, filePathRelativeToUserRootDir }) => {
        const result = await transpileAndLoadPageConfig(filePathAbsolute)
        if ('err' in result) {
          return { err: result.err }
        }
        return { pageConfigFilePath: filePathRelativeToUserRootDir, pageConfigFileExports: result.exports }
      })
  )
  for (const result of results) {
    if ('err' in result) {
      assert(result.err)
      return {
        err: result.err
      }
    }
  }
  results.forEach((result) => {
    assert(!('err' in result))
    const { pageConfigFilePath, pageConfigFileExports } = result
    pageConfigFiles.push({
      pageConfigFilePath,
      pageConfigFileExports
    })
  })

  return { pageConfigFiles }
}

type FoundFile = {
  filePathRelativeToUserRootDir: string
  filePathAbsolute: string
}

async function findUserFiles(pattern: string | string[], userRootDir: string, isDev: boolean): Promise<FoundFile[]> {
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

function handleBuildError(err: unknown, isDev: boolean) {
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

function isRelevantConfigPath(
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

function getPageConfigGlobal(pageConfigFiles: PageConfigFile[]): null | PageConfigFile {
  if (pageConfigFiles.length === 0) return null
  let candidate: PageConfigFile = pageConfigFiles[0]!
  pageConfigFiles.forEach((p) => {
    if (dir(p.pageConfigFilePath).length < dir(candidate.pageConfigFilePath).length) {
      candidate = p
    }
  })
  if (pageConfigFiles.some((p) => !dir(p.pageConfigFilePath).startsWith(dir(candidate.pageConfigFilePath)))) {
    return null
  } else {
    const pageConfigGlobal = candidate
    return pageConfigGlobal
  }
}
function dir(filePath: string) {
  assertPosixPath(filePath)
  return path.posix.dirname(filePath)
}

function isGlobal(configName: string): configName is GlobalConfigName {
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
