export { loadPageConfigsData }

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
  hasProp,
  scriptFileExtensions,
  transpileAndLoadScriptFile
} from '../../../utils'
import path from 'path'
import type { ConfigName, PageConfigData, PageConfigGlobal } from '../../../../../shared/page-configs/PageConfig'
import { configDefinitionsBuiltIn, type ConfigDefinition } from './configDefinitionsBuiltIn'
import glob from 'fast-glob'

type ConfigDefinitionsAll = Record<string, ConfigDefinition>

async function loadPageConfigsData(
  userRootDir: string,
  isDev: boolean
): Promise<{ pageConfigsData: PageConfigData[]; pageConfigGlobal: PageConfigGlobal }> {
  const result = await loadPageConfigFiles(userRootDir)
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
  const { pageConfigsData, pageConfigGlobal } = getPageConfigsData(pageConfigFiles, userRootDir)
  return { pageConfigsData, pageConfigGlobal }
}

function getPageConfigsData(pageConfigFiles: PageConfigFile[], userRootDir: string) {
  const pageConfigGlobal: PageConfigGlobal = {}
  const pageConfigsData: PageConfigData[] = []

  const pageConfigFilesAbstract = pageConfigFiles.filter((p) => isAbstract(p))
  const pageConfigFilesConcrete = pageConfigFiles.filter((p) => !isAbstract(p))

  pageConfigFilesConcrete.forEach((pageConfigFile) => {
    const { pageConfigFilePath } = pageConfigFile
    const pageId2 = determinePageId2(pageConfigFilePath)

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
          configFilePath2: configFilePath,
          configSrc: `${configFilePath} > ${configName}`,
          codeFilePath2: null,
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
          configFilePath2: configFilePath,
          codeFilePath2: codeFilePath,
          configSrc: `${codeFilePath} > \`export default\``,
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

    const routeFilesystem = isErrorPage ? null : determineRouteFromFilesystemPath(pageConfigFilePath)

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
      )} to a value with an invalid type \`${typeof configValue}\` but it should be a \`string\` instead`
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
      assertUsage(
        isObject(configDefinitions),
        `${pageConfigFilePath} sets the config 'configDefinitions' to a value with an invalid type \`${typeof configDefinitions}\`: it should be an object instead.`
      )
      objectEntries(configDefinitions).forEach(([configName, configDefinition]) => {
        assertUsage(
          isObject(configDefinition),
          `${pageConfigFilePath} sets 'configDefinitions.${configName}' to a value with an invalid type \`${typeof configDefinition}\`: it should be an object instead.`
        )

        // User can override an existing config definition
        const def = {
          ...(configDefinitionsAll[configName] as ConfigDefinition | undefined),
          ...configDefinition
        }

        // Validation
        {
          {
            const prop = 'c_env'
            const hint = `Make sure to define the 'c_env' value of '${configName}' to 'client-only', 'server-only', or 'server-and-client'.`
            assertUsage(
              prop in def,
              `${pageConfigFilePath} doesn't define 'configDefinitions.${configName}.c_env' which is required. ${hint}`
            )
            assertUsage(
              hasProp(def, prop, 'string'),
              `${pageConfigFilePath} sets 'configDefinitions.${configName}.c_env' to a value with an invalid type ${typeof def.c_env}. ${hint}`
            )
            assertUsage(
              ['client-only', 'server-only', 'server-and-client'].includes(def.c_env),
              `${pageConfigFilePath} sets 'configDefinitions.${configName}.c_env' to an invalid value '${def.c_env}'. ${hint}`
            )
          }
        }

        configDefinitionsAll[configName] = def
      })
    }
  })
  return configDefinitionsAll
}

type PageConfigFile = {
  pageConfigFilePath: string
  pageConfigFileExports: Record<string, unknown>
}

async function loadPageConfigFiles(
  userRootDir: string
): Promise<{ err: unknown } | { pageConfigFiles: PageConfigFile[] }> {
  const pageConfigFilePaths = await findUserFiles(`**/+config.${scriptFileExtensions}`, userRootDir)

  const pageConfigFiles: PageConfigFile[] = []
  // TODO: make esbuild build everyting at once
  const results = await Promise.all(
    pageConfigFilePaths.map(async ({ filePathAbsolute, filePathRelativeToUserRootDir }) => {
      const result = await transpileAndLoadScriptFile(filePathAbsolute)
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

async function findUserFiles(pattern: string | string[], userRootDir: string) {
  assertPosixPath(userRootDir)
  const timeBase = new Date().getTime()
  const result = await glob(pattern, {
    ignore: ['**/node_modules/**'],
    cwd: userRootDir,
    dot: false
  })
  const time = new Date().getTime() - timeBase
  assertWarning(
    time < 2 * 1000,
    `Crawling your user files took an unexpected long time (${time}ms). Create a new issue on vite-plugin-ssr's GitHub.`,
    {
      showStackTrace: false,
      onlyOnce: 'slow-page-files-search'
    }
  )
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
    // [vite-plugin-ssr:virtualModulePageFiles] Could not load virtual:vite-plugin-ssr:pageFiles:server: [vite-plugin-ssr@0.4.70][Wrong Usage] /pages/+config.ts sets the config 'onRenderHtml' to the value './+config/onRenderHtml-i-dont-exist.js' but no file was found at /home/rom/code/vite-plugin-ssr/examples/v1/pages/+config/onRenderHtml-i-dont-exist.js
    // Error: [vite-plugin-ssr@0.4.70][Wrong Usage] /pages/+config.ts sets the config 'onRenderHtml' to the value './+config/onRenderHtml-i-dont-exist.js' but no file was found at /home/rom/code/vite-plugin-ssr/examples/v1/pages/+config/onRenderHtml-i-dont-exist.js
    //     at resolveCodeFilePath (/home/rom/code/vite-plugin-ssr/vite-plugin-ssr/dist/cjs/node/plugin/plugins/generateImportGlobs/file.js:203:33)
    //     at /home/rom/code/vite-plugin-ssr/vite-plugin-ssr/dist/cjs/node/plugin/plugins/generateImportGlobs/file.js:100:38
    //     at Array.forEach (<anonymous>)
    //     at /home/rom/code/vite-plugin-ssr/vite-plugin-ssr/dist/cjs/node/plugin/plugins/generateImportGlobs/file.js:84:14
    //     at Array.forEach (<anonymous>)
    //     at getCode (/home/rom/code/vite-plugin-ssr/vite-plugin-ssr/dist/cjs/node/plugin/plugins/generateImportGlobs/file.js:75:29)
    //     at async file (/home/rom/code/vite-plugin-ssr/vite-plugin-ssr/dist/cjs/node/plugin/plugins/generateImportGlobs/file.js:40:16)
    //     at async generateGlobImports (/home/rom/code/vite-plugin-ssr/vite-plugin-ssr/dist/cjs/node/plugin/plugins/generateImportGlobs.js:188:3)
    //     at async getCode (/home/rom/code/vite-plugin-ssr/vite-plugin-ssr/dist/cjs/node/plugin/plugins/generateImportGlobs.js:78:20)
    //     at async Object.load (/home/rom/code/vite-plugin-ssr/vite-plugin-ssr/dist/cjs/node/plugin/plugins/generateImportGlobs.js:60:26)
    //     at async file:///home/rom/code/vite-plugin-ssr/node_modules/.pnpm/rollup@3.7.3/node_modules/rollup/dist/es/shared/rollup.js:22610:75
    //     at async Queue.work (file:///home/rom/code/vite-plugin-ssr/node_modules/.pnpm/rollup@3.7.3/node_modules/rollup/dist/es/shared/rollup.js:23509:32) {
    //   code: 'PLUGIN_ERROR',
    //   plugin: 'vite-plugin-ssr:virtualModulePageFiles',
    //   hook: 'load',
    //   watchFiles: [
    //     '/home/rom/code/vite-plugin-ssr/vite-plugin-ssr/dist/cjs/node/importBuild.js',
    //     '\x00virtual:vite-plugin-ssr:pageFiles:server'
    //   ]
    // }
    //  ELIFECYCLE  Command failed with exit code 1.
    // ```
    console.log('')
    console.error(err)
    process.exit(1)
  }
}
