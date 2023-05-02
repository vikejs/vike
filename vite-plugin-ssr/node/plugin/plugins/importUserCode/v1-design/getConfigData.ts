export { getConfigData }
export type { PlusValueFile }
export type { PlusConfigFile }

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
  objectAssign,
  hasProp,
  arrayIncludes,
  objectKeys,
  assertIsVitePluginCode,
  getMostSimilar,
  isNpmPackageImportPath,
  joinEnglish
} from '../../../utils'
import path from 'path'
import type {
  ConfigName,
  ConfigElement,
  ConfigEnv,
  PlusConfigData,
  PlusConfigGlobalData
} from '../../../../../shared/page-configs/PlusConfig'
import { configDefinitionsBuiltIn, type ConfigDefinition } from './getConfigData/configDefinitionsBuiltIn'
import glob from 'fast-glob'
import type { ExtensionResolved } from '../../../../../shared/ConfigVps'
import {
  determinePageId,
  determineRouteFromFilesystemPath,
  isRelevantConfig,
  pickMostRelevantConfigValue
} from './getConfigData/filesystemRouting'
import { transpileAndLoadPlusConfig, transpileAndLoadPlusValueFile } from './transpileAndLoadPlusFile'
import { parseImportData } from './replaceImportStatements'
import { getPlusConfigValue, getPlusConfigValues } from './getConfigData/helpers'

assertIsVitePluginCode()

type ConfigData = {
  plusConfigsData: PlusConfigData[]
  plusConfigGlobal: PlusConfigGlobalData
  vikeConfig: Record<string, unknown>
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

  const result = await findAndLoadPlusConfigFiles(plusFiles)
  /* TODO: - remove this if we don't need this for optimizeDeps.entries
   *       - also remove whole result.err try-catch mechanism, just let esbuild throw instead
  if ('err' in result) {
    return ['export const plusConfigs = null;', 'export const plusConfigGlobal = null;'].join('\n')
  }
  */
  if ('err' in result) {
    handleConfigError(result.err, isDev)
    assert(false)
  }
  const { plusConfigFiles } = result

  let plusValueFiles: PlusValueFile[]
  {
    const configDefinitions = getConfigDefinitions(plusConfigFiles)
    plusValueFiles = await findAndLoadPlusValueFiles(plusFiles, configDefinitions)
  }

  const vikeConfig: Record<string, unknown> = {}
  const plusConfigGlobal: PlusConfigGlobalData = {
    onBeforeRoute: null,
    onPrerenderStart: null
  }
  {
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
    const plusValueFilesRelevant = plusValueFiles.filter((c) => {
      // TODO: assert that there should be only one
      // TODO: assert filesystem location
      return isGlobal(c.configName)
    })
    objectEntries(globalConfigsDefinition).forEach(([configName, configDef]) => {
      const configElement = resolveConfigElement(
        configName,
        configDef,
        plusConfigFilesGlobal,
        userRootDir,
        plusValueFilesRelevant
      )
      if (!configElement) return
      if (arrayIncludes(objectKeys(plusConfigGlobal), configName)) {
        assert(!('configValue' in configElement))
        plusConfigGlobal[configName] = configElement
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
  }

  const pageIds = determinePageIds(plusConfigFiles, plusValueFiles)

  const plusConfigsData: PlusConfigData[] = []
  pageIds.forEach(({ pageId, routeFilesystem, plusConfigFile, routeFilesystemDefinedBy }) => {
    const plusConfigFilesRelevant = plusConfigFiles.filter(({ plusConfigFilePath }) =>
      isRelevantConfig(plusConfigFilePath, pageId)
    )
    const plusValueFilesRelevant = plusValueFiles
      .filter(({ plusValueFilePath }) => isRelevantConfig(plusValueFilePath, pageId))
      .filter((plusValueFile) => !isGlobal(plusValueFile.configName))
    let configDefinitionsRelevant = getConfigDefinitions(plusConfigFilesRelevant)

    if (plusConfigFile) {
      const plusConfigValues = getPlusConfigValues(plusConfigFile)
      Object.keys(plusConfigValues).forEach((configName) => {
        // TODO: this applies only against concrete config files, we should also apply to abstract config files
        assertConfigName(
          configName,
          [...Object.keys(configDefinitionsRelevant), 'meta'],
          plusConfigFile.plusConfigFilePath
        )
      })
    }

    // TODO: remove this and instead ensure that configs are always defined globally
    plusValueFilesRelevant.forEach((plusValueFile) => {
      const { configName } = plusValueFile
      assert(configName in configDefinitionsRelevant || configName === 'meta')
    })

    let configElements: PlusConfigData['configElements'] = {}
    objectEntries(configDefinitionsRelevant).forEach(([configName, configDef]) => {
      const configElement = resolveConfigElement(
        configName,
        configDef,
        plusConfigFilesRelevant,
        userRootDir,
        plusValueFilesRelevant
      )
      if (!configElement) return
      configElements[configName as ConfigName] = configElement
    })

    configElements = applyEffects(configElements, configDefinitionsRelevant)

    const isErrorPage = determineIsErrorPage(routeFilesystem)

    plusConfigsData.push({
      pageId,
      isErrorPage,
      routeFilesystemDefinedBy,
      plusConfigFilePathAll: plusConfigFilesRelevant.map((p) => p.plusConfigFilePath),
      routeFilesystem: isErrorPage ? null : routeFilesystem,
      configElements
    })
  })

  return { plusConfigsData, plusConfigGlobal, vikeConfig }
}

function determinePageIds(plusConfigFiles: PlusConfigFile[], plusValueFiles: PlusValueFile[]) {
  const pageIds: {
    pageId: string
    routeFilesystem: string
    plusConfigFile: null | PlusConfigFile
    routeFilesystemDefinedBy: string
  }[] = []
  plusValueFiles.map((plusValueFile) => {
    if (!isDefiningPlusConfig(plusValueFile.configName)) return
    const { plusValueFilePath } = plusValueFile
    const pageId = determinePageId(plusValueFilePath)
    const routeFilesystem = determineRouteFromFilesystemPath(plusValueFilePath)
    assertPosixPath(plusValueFilePath)
    const routeFilesystemDefinedBy = path.posix.dirname(plusValueFilePath) + '/'
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
      plusConfigFile: null,
      routeFilesystemDefinedBy
    })
  })
  plusConfigFiles.forEach((plusConfigFile) => {
    const { plusConfigFilePath } = plusConfigFile
    const pageId = determinePageId(plusConfigFilePath)
    const routeFilesystem = determineRouteFromFilesystemPath(plusConfigFilePath)
    {
      const alreadyIncluded = pageIds.some((p) => {
        if (p.pageId === pageId) {
          assert(p.routeFilesystem === routeFilesystem)
          assert(p.plusConfigFile === null)
          p.plusConfigFile = plusConfigFile
          return true
        }
        return false
      })
      if (alreadyIncluded) return
    }
    if (isDefiningPage(plusConfigFile)) {
      pageIds.push({
        pageId,
        routeFilesystem,
        plusConfigFile,
        routeFilesystemDefinedBy: plusConfigFilePath
      })
    }
  })
  return pageIds
}

function resolveConfigElement(
  configName: string,
  configDef: ConfigDefinition,
  plusConfigFilesRelevant: PlusConfigFile[],
  userRootDir: string,
  plusValueFilesRelevant: PlusValueFile[]
): null | ConfigElement {
  // TODO: implement warning if defined in non-abstract +config.js as well as in +{configName}.js

  const result = pickMostRelevantConfigValue(configName, plusValueFilesRelevant, plusConfigFilesRelevant)
  if (!result) return null

  if ('plusValueFile' in result) {
    const { plusValueFile } = result
    const { plusValueFilePath } = plusValueFile
    const plusValueFileExport = 'default'
    const configElement: ConfigElement = {
      configEnv: configDef.env,
      plusValueFilePath,
      plusValueFileExport,
      plusConfigFilePath: null,
      configDefinedAt: `${plusValueFilePath} > \`export ${plusValueFileExport}\``,
      configDefinedByFile: plusValueFilePath
    }
    if ('configValue' in plusValueFile) {
      configElement.configValue = plusValueFile.configValue
    }
    return configElement
  }

  const { plusConfigFile } = result
  const configValue = getPlusConfigValue(configName, plusConfigFile)
  const { plusConfigFilePath } = plusConfigFile
  const { c_code, c_validate } = configDef
  const codeFile = getCodeFilePath(configValue, plusConfigFilePath, userRootDir, configName, c_code)
  assert(codeFile || !c_code) // TODO: assertUsage() or remove
  if (c_validate) {
    const commonArgs = { configFilePath: plusConfigFilePath }
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
      plusConfigFilePath,
      configDefinedAt: `${plusConfigFilePath} > ${configName}`,
      configDefinedByFile: plusConfigFilePath,
      plusValueFilePath: null,
      plusValueFileExport: null,
      configEnv: env,
      configValue
    }
  } else {
    assertUsage(
      typeof configValue === 'string',
      `${getErrorIntro(
        plusConfigFilePath,
        configName
      )} to a value with a wrong type \`${typeof configValue}\`: it should be a string instead`
    )
    const { codeFilePath, plusValueFileExport } = codeFile
    return {
      plusConfigFilePath,
      plusValueFilePath: codeFilePath,
      plusValueFileExport,
      configDefinedAt: `${codeFilePath} > \`export ${plusValueFileExport}\``,
      configDefinedByFile: codeFilePath,
      configEnv: env
    }
  }
}

function isDefiningPage(plusConfigFile: PlusConfigFile): boolean {
  const plusConfigValues = getPlusConfigValues(plusConfigFile)
  return Object.keys(plusConfigValues).some((configName) => isDefiningPlusConfig(configName))
}
function isDefiningPlusConfig(configName: string): boolean {
  return ['Page', 'route'].includes(configName)
}

function getCodeFilePath(
  configValue: unknown,
  plusConfigFilePath: string,
  userRootDir: string,
  configName: string,
  enforce: undefined | boolean
): null | { codeFilePath: string; plusValueFileExport: string } {
  if (typeof configValue !== 'string' || configValue === '') {
    assertUsage(
      !enforce,
      `${getErrorIntro(
        plusConfigFilePath,
        configName
      )} to a value with an invalid type \`${typeof configValue}\` but it should be a \`string\` instead`
    )
    return null
  }
  if (configValue === '') {
    assertUsage(
      !enforce,
      `${getErrorIntro(plusConfigFilePath, configName)} to a value with an invalid value '' (emtpy string)`
    )
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
  let codeFilePath = path.posix.join(userRootDir, path.posix.dirname(plusConfigFilePath), toPosixPath(importPath))
  const plusValueFileExport = importName
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

  /* TODO: remove
  if (!importData) {
    assertCodeFilePathConfigValue(configValue, plusConfigFilePath, codeFilePath, fileExists, configName)
  }
  */

  // Make relative to userRootDir
  codeFilePath = getVitePathFromAbsolutePath(codeFilePath, userRootDir)

  assertPosixPath(codeFilePath)
  assert(codeFilePath.startsWith('/'))
  assertUsage(fileExists, `${plusConfigFilePath} imports from '${importPath}' which points to a non-existing file`)
  return { codeFilePath, plusValueFileExport }
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
    const plusConfigDir = dirnameNormalized(plusConfigFilePath)
    assertWarning(
      false,
      `${errIntro2} a relative path instead (i.e. a path that starts with './' or '../') that is relative to ${plusConfigDir}`,
      warnArgs
    )
  } else if (!['./', '../'].some((prefix) => configValueFixed.startsWith(prefix))) {
    // It isn't possible to omit '../' so we can assume that the path is relative to plusConfigDir
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
  const plusConfigDir = dirnameNormalized(plusConfigFilePath)
  if (!codeFilePath.startsWith('/')) {
    assertPosixPath(codeFilePath)
    assertPosixPath(plusConfigFilePath)
    codeFilePath = path.posix.join(plusConfigDir, codeFilePath)
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

function getErrorIntro(filePath: string, configName: string): string {
  assert(filePath.startsWith('/') || isNpmPackageImportPath(filePath))
  assert(!configName.startsWith('/'))
  return `${filePath} sets the config ${configName}`
}

function getConfigDefinitions(plusConfigFilesRelevant: PlusConfigFile[]): ConfigDefinitionsExtended {
  const configDefinitions: ConfigDefinitionsExtended = { ...configDefinitionsBuiltIn }
  plusConfigFilesRelevant.forEach((plusConfigFile) => {
    const { plusConfigFilePath } = plusConfigFile
    const { meta } = getPlusConfigValues(plusConfigFile)
    if (meta) {
      assertUsage(
        isObject(meta),
        `${plusConfigFilePath} sets the config 'meta' to a value with an invalid type \`${typeof meta}\`: it should be an object instead.`
      )
      objectEntries(meta).forEach(([configName, configDefinition]) => {
        assertUsage(
          isObject(configDefinition),
          `${plusConfigFilePath} sets 'meta.${configName}' to a value with an invalid type \`${typeof configDefinition}\`: it should be an object instead.`
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
          configDefinedAt: `${configElementEffect} (side-effect)`,
          // TODO-end
          configEnv: configElementTargetOld.configEnv,
          configValue: configModValue
        }
      }
    })
  })

  return configElementsMod
}

type PlusConfigFile = {
  plusConfigFilePath: string
  plusConfigFileExports: Record<string, unknown>
}

async function findPlusFiles(userRootDir: string, isDev: boolean, extensions: ExtensionResolved[]) {
  const plusFiles = await findUserFiles('**/+*', userRootDir, isDev)
  extensions.forEach((extension) => {
    extension.plusConfigsDistFiles?.forEach((plusConfigDistFile) => {
      // TODO/v1-release: remove
      if (!plusConfigDistFile.importPath.includes('+')) return
      assert(plusConfigDistFile.importPath.includes('+'))
      assert(path.posix.basename(plusConfigDistFile.importPath).startsWith('+'))
      const { importPath, filePath } = plusConfigDistFile
      plusFiles.push({
        filePathRelativeToUserRootDir: importPath,
        filePathAbsolute: filePath
      })
    })
  })
  return plusFiles
}

type PlusValueFile = {
  pageId: string
  configName: string
  plusValueFilePath: string
  configValue?: unknown
}
async function findAndLoadPlusValueFiles(
  plusFiles: FoundFile[],
  configDefinitions: ConfigDefinitionsExtended
): Promise<PlusValueFile[]> {
  const plusValueFiles: PlusValueFile[] = await Promise.all(
    plusFiles
      .filter((f) => extractConfigName(f.filePathRelativeToUserRootDir) !== 'config')
      .map((f) => loadPlusValueFile(f, configDefinitions))
  )
  return plusValueFiles
}

async function loadPlusValueFile(plusFile: FoundFile, configDefinitions: ConfigDefinitionsExtended) {
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
  const plusValueFile: PlusValueFile = {
    configName,
    pageId: determinePageId(filePathRelativeToUserRootDir),
    plusValueFilePath: filePathRelativeToUserRootDir
  }
  if (configDef.env !== 'config-only') {
    return plusValueFile
  }
  const result = await transpileAndLoadPlusValueFile(filePathAbsolute)
  if ('err' in result) {
    throw result.err
  }
  const { fileExports } = result
  assertDefaultExportUnknown(fileExports, filePathRelativeToUserRootDir)
  const configValue = fileExports.default
  objectAssign(plusValueFile, { configValue })
  return plusValueFile
}

function extractConfigName(filePath: string) {
  assertPosixPath(filePath)
  const basename = path.posix.basename(filePath).split('.')[0]!
  assert(basename.startsWith('+'))
  const configName = basename.slice(1)
  return configName
}

async function findAndLoadPlusConfigFiles(
  plusFiles: FoundFile[]
): Promise<{ err: unknown } | { plusConfigFiles: PlusConfigFile[] }> {
  const plusConfigFiles: PlusConfigFile[] = []
  // TODO: make esbuild build everyting at once
  const results = await Promise.all(
    plusFiles
      .filter((f) => extractConfigName(f.filePathRelativeToUserRootDir) === 'config')
      .map(async ({ filePathAbsolute, filePathRelativeToUserRootDir }) => {
        const result = await transpileAndLoadPlusConfig(filePathAbsolute, filePathRelativeToUserRootDir)
        if ('err' in result) {
          return { err: result.err }
        }
        return { plusConfigFilePath: filePathRelativeToUserRootDir, plusConfigFileExports: result.fileExports }
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
    const { plusConfigFilePath, plusConfigFileExports } = result
    plusConfigFiles.push({
      plusConfigFilePath,
      plusConfigFileExports
    })
  })

  return { plusConfigFiles }
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

function handleConfigError(err: unknown, isDev: boolean) {
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

function getPlusConfigFilesGlobal(plusConfigFiles: PlusConfigFile[]): PlusConfigFile[] {
  return plusConfigFiles.filter((p) => {
    const filePath = p.plusConfigFilePath
    const routeFilesystem = determineRouteFromFilesystemPath(filePath)
    return routeFilesystem === '/'
  })
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
