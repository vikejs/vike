export { getPageConfigsData }

import {
  determinePageId2,
  determineRouteFromFilesystemPath
} from '../../../../../shared/route/deduceRouteStringFromFilesystemPath'
import {
  assertPosixPath,
  assert,
  isObject,
  assertUsage,
  isPosixPath,
  toPosixPath,
  assertWarning,
  addFileExtensionsToRequireResolve,
  assertDefaultExport,
  objectEntries,
  hasProp
} from '../../../utils'
import path from 'path'
import type { ConfigName, PageConfigData, PageConfigGlobal } from '../../../../../shared/page-configs/PageConfig'
import type { PageConfigFile } from './loadPageConfigFiles'
import { configDefinitionsBuiltIn, type ConfigDefinition } from './configDefinitionsBuiltIn'

type ConfigDefinitionsAll = Record<string, ConfigDefinition>

function getPageConfigsData(pageConfigFiles: PageConfigFile[], userRootDir: string) {
  const pageConfigGlobal: PageConfigGlobal = {}
  const pageConfigsData: PageConfigData[] = []

  const pageConfigFilesAbstract = pageConfigFiles.filter((p) => isAbstract(p))
  const pageConfigFilesConcrete = pageConfigFiles.filter((p) => !isAbstract(p))

  pageConfigFilesConcrete.forEach((pageConfigFile) => {
    const { pageConfigFilePath } = pageConfigFile
    const pageId2 = determinePageId2(pageConfigFilePath)

    const routeFilesystem = determineRouteFromFilesystemPath(pageConfigFilePath)

    const pageConfigFilesRelevant = [pageConfigFile, ...pageConfigFilesAbstract]
    const configDefinitionsAll = getConfigDefinitionsAll(pageConfigFilesRelevant)

    {
      const pageConfigValues = getPageConfigValues(pageConfigFile)
      Object.keys(pageConfigValues).forEach((configName) => {
        assertUsage(
          configName in configDefinitionsAll || configName === 'configDefinitions',
          `${pageConfigFilePath} defines an unknown config '${configName}'`
        )
      })
    }

    const configSources: PageConfigData['configSources'] = {}
    objectEntries(configDefinitionsAll).forEach(([configName, configDef]) => {
      // TODO: properly determine relevant abstract page configs
      const result = resolveConfig(configName, configDef, pageConfigFile, pageConfigFilesAbstract, userRootDir)
      if (!result) return
      const { c_env } = configDef
      const { configValue, codeFilePath, configFilePath } = result
      if (!codeFilePath) {
        configSources[configName as ConfigName] = {
          configFilePath,
          c_env,
          configValue
        }
      } else {
        assertUsage(
          typeof configValue === 'string',
          `${getErrorIntro(
            pageConfigFilePath,
            configName
          )} to a value with a wrong type \`${typeof configValue}\`: it should be a string instead`
        )
        configSources[configName as ConfigName] = {
          configFilePath,
          codeFilePath,
          c_env
        }
      }
    })

    // TODO: properly determine relevant abstract page configs
    const pageConfigFilePathAll = [
      pageConfigFile.pageConfigFilePath,
      ...pageConfigFilesAbstract.map((p) => p.pageConfigFilePath)
    ]

    const isErrorPage: boolean = !!configSources.isErrorPage?.configValue

    pageConfigsData.push({
      pageId2,
      isErrorPage,
      pageConfigFilePath,
      pageConfigFilePathAll,
      routeFilesystem,
      configSources
    })
  })

  return { pageConfigsData, pageConfigGlobal }
}

function resolveConfig(
  configName: string,
  configDef: ConfigDefinition,
  pageConfigFile: PageConfigFile,
  pageConfigFilesAbstract: PageConfigFile[],
  userRootDir: string
) {
  const result = getConfigValue(configName, pageConfigFile, pageConfigFilesAbstract)
  if (!result) return null
  const { pageConfigValue, pageConfigValueFilePath } = result
  const configValue = pageConfigValue
  const configFilePath = pageConfigValueFilePath
  const { c_code, c_validate } = configDef
  const codeFilePath = getCodeFilePath(pageConfigValue, pageConfigValueFilePath, userRootDir, configName, c_code)
  assert(codeFilePath || !c_code) // TODO: assertUsage() or remove
  if (c_validate) {
    const commonArgs = { configFilePath }
    if (codeFilePath) {
      assert(typeof configValue === 'string')
      c_validate({ configValue, codeFilePath, ...commonArgs })
    } else {
      c_validate({ configValue, ...commonArgs })
    }
  }
  return { configValue, configFilePath, codeFilePath }
}

function isAbstract(pageConfigFile: PageConfigFile): boolean {
  const pageConfigValues = getPageConfigValues(pageConfigFile)
  return !pageConfigValues.Page && !pageConfigValues.route && !pageConfigValues.isErrorPage
}

function getCodeFilePath(
  configValue: unknown,
  pageConfigFilePath: string,
  userRootDir: string,
  configName: string,
  enforce: undefined | boolean
): null | string {
  if (typeof configValue !== 'string') {
    assertUsage(
      !enforce,
      `${getErrorIntro(
        pageConfigFilePath,
        configName
      )} to a value with type '${typeof configValue}' but it should be a string instead`
    )
    return null
  }

  let codeFilePath = getVitePathFromConfigValue(toPosixPath(configValue), pageConfigFilePath)
  assertPosixPath(userRootDir)
  assertPosixPath(codeFilePath)
  codeFilePath = path.posix.join(userRootDir, codeFilePath)
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
  assertCodeFilePathConfigValue(configValue, pageConfigFilePath, codeFilePath, fileExists, configName)

  // Make relative to userRootDir
  codeFilePath = getVitePathFromAbsolutePath(codeFilePath, userRootDir)

  assert(fileExists)
  assertPosixPath(codeFilePath)
  assert(codeFilePath.startsWith('/'))
  return codeFilePath
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

function getErrorIntro(pageConfigFilePath: string, configName: string): string {
  assert(pageConfigFilePath.startsWith('/'))
  assert(!configName.startsWith('/'))
  return `${pageConfigFilePath} sets the config ${configName}`
}

function getConfigValue(
  pageConfigName: string,
  pageConfigFile: PageConfigFile,
  pageConfigFilesAbstract: PageConfigFile[]
): null | { pageConfigValueFilePath: string; pageConfigValue: unknown } {
  const configFiles: PageConfigFile[] = [pageConfigFile, ...pageConfigFilesAbstract]
  for (const configFile of configFiles) {
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
  assertDefaultExport(pageConfigFileExports, pageConfigFilePath)
  const pageConfigValues = pageConfigFileExports.default
  assertUsage(
    isObject(pageConfigValues),
    `${pageConfigFilePath} should export an object (it exports a \`${typeof pageConfigValues}\` instead)`
  )
  return pageConfigValues
}

function getConfigDefinitionsAll(pageConfigFilesRelevant: PageConfigFile[]): ConfigDefinitionsAll {
  const configDefinitionsAll: ConfigDefinitionsAll = { ...configDefinitionsBuiltIn }
  pageConfigFilesRelevant.forEach((pageConfigFile) => {
    const { pageConfigFilePath } = pageConfigFile
    const { configDefinitions } = getPageConfigValues(pageConfigFile)
    if (configDefinitions) {
      const msgWrongType = `to a value with an invalid type \`${typeof pageConfigFilePath}\`: it should be an object instead`
      assertUsage(
        isObject(configDefinitions),
        `${pageConfigFilePath} sets the config 'configDefinitions' ${msgWrongType}`
      )
      objectEntries(configDefinitions).forEach(([configName, configDef]) => {
        assertUsage(isObject(configDef), `${pageConfigFilePath} sets 'configDefinitions.${configName}' ${msgWrongType}`)
        const configDefMerged = {
          ...(configDefinitionsAll[configName] as ConfigDefinition | undefined),
          ...configDef
        }
        const msgHint = `Make sure to define the 'c_env' value of '${configName}' to 'client-only', 'server-only', or 'server-and-client'`
        assertUsage(
          hasProp(configDefMerged, 'c_env', 'string'),
          `${pageConfigFilePath} defines 'configDefinitions.${configName}' but without defining its 'c_env' value which is required. ${msgHint}`
        )
        assertUsage(
          ['client-only', 'server-only', 'server-and-client'].includes(configDefMerged.c_env),
          `${pageConfigFilePath} sets 'configDefinitions.${configName}.c_env' to an invalid value '${configDefMerged.c_env}'. ${msgHint}`
        )
        configDefinitionsAll[configName] = configDefMerged
      })
    }
  })
  return configDefinitionsAll
}
