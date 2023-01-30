export { generatePageConfigsSourceCode }
export { generatePageConfigVirtualFile }

import {
  determinePageId2,
  determineRouteFromFilesystemPath
} from '../../../../shared/route/deduceRouteStringFromFilesystemPath'
import {
  assertPosixPath,
  assert,
  isObject,
  assertUsage,
  isPosixPath,
  toPosixPath,
  assertWarning,
  addFileExtensionsToRequireResolve,
  isCallable,
  assertDefaultExport
} from '../../utils'
import path from 'path'

import type { c_Env, PageConfigData, PageConfigGlobal } from '../../../../shared/page-configs/PageConfig'
import { loadPageConfigFiles, PageConfigFile } from '../../helpers'
import { assertRouteString } from '../../../../shared/route/resolveRouteString'
import { generateEagerImport } from './generateEagerImport'
const virtualIdPageConfigCode = 'virtual:vite-plugin-ssr:pageConfigCode:'

let pageConfigsData: null | PageConfigData[] = null

// TODO: ensure that client-side of Server Routing loads less than Client Routing
// TODO: create one virtual file per route
// TODO: if conf isn't file path then assert that it's serialazable

// TODO: remove c_ prefix
type ConfigName = string
type ConfigSpec = {
  c_env: c_Env
  c_global?: boolean // TODO: implement
  c_required?: boolean // TODO: apply validation
  c_code?: boolean // TODO: remove? Or rename to `type: 'code'`
  c_validate?: (
    configResolved: ({ configValue: unknown } | { configValue: string; codeFilePath: string }) & {
      configFilePath: string
    }
  ) => void | undefined
}
const configDefinitions: Record<ConfigName, ConfigSpec> = {
  onRenderHtml: {
    c_code: true,
    c_required: true,
    c_env: 'server-only'
  },
  onRenderClient: {
    c_code: true,
    c_env: 'client-only'
  },
  Page: {
    c_code: true,
    c_env: 'server-and-client'
  },
  passToClient: {
    c_code: false,
    c_env: 'server-only'
  },
  route: {
    c_code: false,
    c_env: 'routing',
    c_validate(configResolved) {
      const { configFilePath, configValue } = configResolved
      if ('codeFilePath' in configResolved) return
      if (typeof configValue === 'string') {
        assertRouteString(configValue, `${configFilePath} defines an`)
      } else {
        if (isCallable(configValue)) {
          const routeFunctionName = configValue.name || 'myRouteFunction'
          // TODO/v1: point to https://vite-plugin-ssr.com/route-function
          // TODO: write https://vite-plugin-ssr.com/v1-design
          assertUsage(
            false,
            `${configFilePath} sets a Route Function directly \`route: function ${routeFunctionName}() { /* ... */ }\` which is forbidden: instead define a file \`route: './path/to/route-file.js'\` that exports your Route Function \`export default ${routeFunctionName}() { /* ... */ }\`. See https://vite-plugin-ssr.com/v1-design for more information.`
          )
        }
        // TODO/v1: point to https://vite-plugin-ssr.com/routing#route-strings-route-functions
        // TODO: write https://vite-plugin-ssr.com/v1-design
        assertUsage(
          false,
          `${configFilePath} sets the configuration 'route' to a value with an invalid type \`${typeof configValue}\`: the value should be a string (a Route String or the path of a route file exporting a Route Function). See https://vite-plugin-ssr.com/v1-design for more information.`
        )
      }
    }
  },
  iKnowThePerformanceRisksOfAsyncRouteFunctions: {
    c_code: false,
    c_env: 'server-and-client'
  }
  /* TODO
  onBeforeRoute: {
    c_code: true,
    c_global: true,
    c_env: 'routing'
  }
  configDefinitions: {
    c_code: false,
    c_env: 'config'
  },
  onBeforeRender: {
    c_code: true,
    c_env: 'server-only'
  },
  */
}

async function generatePageConfigsSourceCode(
  userRootDir: string,
  isForClientSide: boolean,
  isDev: boolean
): Promise<string> {
  try {
    return await getCode(userRootDir, isForClientSide)
  } catch (err) {
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
}

async function getCode(userRootDir: string, isForClientSide: boolean): Promise<string> {
  const result1 = await loadPageConfigFiles(userRootDir)
  if ('hasError' in result1) {
    return ['export const pageConfigs = null;', 'export const pageConfigGlobal = null;'].join('\n')
  }
  const { pageConfigFiles } = result1
  const result2 = getPageConfigsData(pageConfigFiles, userRootDir)
  pageConfigsData = result2.pageConfigsData
  const { pageConfigGlobal } = result2
  return generateSourceCodeOfPageConfigs(pageConfigsData, pageConfigGlobal, isForClientSide)
}

function getPageConfigsData(pageConfigFiles: PageConfigFile[], userRootDir: string) {
  const pageConfigGlobal: PageConfigGlobal = {}
  const pageConfigsData: PageConfigData[] = []

  const pageConfigFilesAbstract = pageConfigFiles.filter((p) => isAbstract(p))
  const pageConfigFilesConcrete = pageConfigFiles.filter((p) => !isAbstract(p))
  pageConfigFilesConcrete.forEach((pageConfigFile) => {
    const { pageConfigFilePath } = pageConfigFile
    const pageId2 = determinePageId2(pageConfigFilePath)

    const routeFilesystem = determineRouteFromFilesystemPath(pageConfigFilePath)

    const config: PageConfigData['config'] = {}
    Object.entries(configDefinitions).forEach(([configName, configSpec]) => {
      const result = resolveConfig(configName, configSpec, pageConfigFile, pageConfigFilesAbstract, userRootDir)
      if (!result) return
      const { c_env } = configSpec
      const { configValue, codeFilePath, configFilePath } = result
      if (!codeFilePath) {
        config[configName] = {
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
        config[configName] = {
          configFilePath,
          codeFilePath,
          c_env
        }
      }
    })

    pageConfigsData.push({
      pageConfigFilePath,
      pageId2,
      routeFilesystem,
      config
    })
  })

  return { pageConfigsData, pageConfigGlobal }
}

function generateSourceCodeOfPageConfigs(
  pageConfigsData: PageConfigData[],
  pageConfigGlobal: PageConfigGlobal,
  isForClientSide: boolean
): string {
  const lines: string[] = []
  const importStatements: string[] = []

  lines.push('export const pageConfigs = [];')
  pageConfigsData.forEach((pageConfig, i) => {
    const { pageConfigFilePath, pageId2, routeFilesystem, config } = pageConfig
    const pageConfigVar = `pageConfig${i + 1}`
    const codeFilesImporter = `${virtualIdPageConfigCode}${pageId2}`
    lines.push(`{`)
    lines.push(`  const ${pageConfigVar} = {`)
    lines.push(`    pageId2: '${pageId2}',`)
    lines.push(`    pageConfigFilePath: '${pageConfigFilePath}',`)
    lines.push(`    codeFilesImporter: '${codeFilesImporter}',`)
    lines.push(`    loadCodeFiles: async () => (await import('${codeFilesImporter}')).default,`)
    lines.push(`    configSources: {`)
    Object.entries(config).forEach(([configName, configSource]) => {
      lines.push(`      ['${configName}']: {`)
      const { configFilePath, c_env } = configSource
      lines.push(`        configFilePath: '${configFilePath}',`)
      lines.push(`        c_env: '${c_env}',`)
      if ('configValue' in configSource) {
        const { configValue } = configSource
        lines.push(`        configValue: ${JSON.stringify(configValue)}`)
      } else if (configSource.codeFilePath) {
        const { codeFilePath, c_env } = configSource
        lines.push(`        codeFilePath: '${codeFilePath}',`)
        if (c_env === 'routing') {
          const { importVar, importStatement } = generateEagerImport(codeFilePath)
          // TODO: expose all exports so that assertDefaultExport() can be applied
          lines.push(`        configValue: ${importVar}.default`)
          importStatements.push(importStatement)
        }
      } else {
        assert(false)
      }
      lines.push(`      },`)
    })
    lines.push(`    }`)
    lines.push('  };')
    if (!pageConfig.config.route) {
      lines.push(`  ${pageConfigVar}.route = '${routeFilesystem}';`)
    } else {
      lines.push(`  ${pageConfigVar}.route = ${pageConfigVar}.configSources.route.configValue;`)
    }
    lines.push(`  pageConfigs.push(${pageConfigVar})`)
    lines.push(`}`)
  })

  lines.push('export const pageConfigGlobal = {')
  Object.entries(pageConfigGlobal).forEach(([configName, configValue]) => {
    lines.push(`['${configName}']: ${configValue}`)
  })
  lines.push('};')

  const code = [...importStatements, ...lines].join('\n')
  return code
}

function generatePageConfigVirtualFile(id: string, isForClientSide: boolean) {
  if (!id.startsWith(virtualIdPageConfigCode)) return
  const pageId = id.slice(virtualIdPageConfigCode.length)
  assert(pageConfigsData)
  const pageConfigData = pageConfigsData.find((pageConfigData) => pageConfigData.pageId2 === pageId)
  assert(pageConfigData)
  return generateSourceCodeOfLoadCodeFileVirtualFile(pageConfigData, isForClientSide)
}

function generateSourceCodeOfLoadCodeFileVirtualFile(pageConfigData: PageConfigData, isForClientSide: boolean): string {
  const lines: string[] = []
  const importStatements: string[] = []
  lines.push('export default [')
  let varCounter = 0
  Object.entries(pageConfigData.config).forEach(([configName, configSource]) => {
    if (!('codeFilePath' in configSource)) return
    const { c_env, codeFilePath } = configSource
    if (c_env === (isForClientSide ? 'server-only' : 'client-only')) return
    const { importVar, importStatement } = generateEagerImport(codeFilePath, varCounter++)
    importStatements.push(importStatement)
    lines.push(`  {`)
    lines.push(`    configName: '${configName}',`)
    lines.push(`    codeFilePath: '${codeFilePath}',`)
    lines.push(`    codeFileExports: ${importVar}`)
    lines.push(`  },`)
  })
  lines.push('];')
  const code = [...importStatements, ...lines].join('\n')
  return code
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

function resolveConfig(
  configName: string,
  configSpec: ConfigSpec,
  pageConfigFile: PageConfigFile,
  pageConfigFilesAbstract: PageConfigFile[],
  userRootDir: string
) {
  const result = getConfigValue(configName, pageConfigFile, pageConfigFilesAbstract)
  if (!result) return null
  const { pageConfigValue, pageConfigValueFilePath } = result
  const configValue = pageConfigValue
  const configFilePath = pageConfigValueFilePath
  const { c_code, c_validate } = configSpec
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

function isAbstract(pageConfigFile: PageConfigFile): boolean {
  const pageConfigValues = getPageConfigValues(pageConfigFile)
  return !pageConfigValues.Page && !pageConfigValues.route
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
