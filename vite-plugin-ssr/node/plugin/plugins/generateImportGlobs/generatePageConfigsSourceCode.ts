export { generatePageConfigsSourceCode }

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
  isCallable
} from '../../utils'
import path from 'path'

import type { c_Env, PageConfig2, PageConfigData, PageConfigGlobal } from '../../../../shared/page-configs/PageConfig'
import { loadPageConfigFiles, PageConfigFile } from '../../helpers'
import { assertRouteString } from '../../../../shared/route/resolveRouteString'
import { generateEagerImport } from './generateEagerImport'

// TODO: ensure that client-side of Server Routing loads less than Client Routing

// TODO: remove c_ prefix
const configDefinitions: Record<
  string,
  {
    c_env: c_Env
    c_required?: boolean // TODO: apply validation
    c_global?: boolean // TODO
    c_code?: boolean
  }
> = {
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
    c_env: 'routing'
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
  const result = await loadPageConfigFiles(userRootDir)
  if ('hasError' in result) {
    return ['export const pageConfigs = null;', 'export const pageConfigGlobal = null;'].join('\n')
  }
  const { pageConfigFiles } = result
  const { pageConfigs, pageConfigGlobal } = getPageConfigs(pageConfigFiles, userRootDir, isForClientSide)
  return serializePageConfigs(pageConfigs, pageConfigGlobal)
}

function getPageConfigs(pageConfigFiles: PageConfigFile[], userRootDir: string, isForClientSide: boolean) {
  const pageConfigGlobal: PageConfigGlobal = {}
  const pageConfigs: PageConfigData[] = []

  const pageConfigFilesAbstract = pageConfigFiles.filter((p) => isAbstract(p))
  const pageConfigFilesConcrete = pageConfigFiles.filter((p) => !isAbstract(p))
  pageConfigFilesConcrete.forEach((pageConfigFile) => {
    const { pageConfigFilePath } = pageConfigFile
    const pageConfigValues = getPageConfigValues(pageConfigFile)
    const pageId2 = determinePageId2(pageConfigFilePath)

    const routeFilesystem = determineRouteFromFilesystemPath(pageConfigFilePath)
    /* TODO
    const route: unknown = pageConfigValues.route || 
    assertUsage(
      typeof route === 'string' || isCallable(route),
      `${pageConfigFilePath} sets the config route to a value with an invalid type \`${typeof route}\`: the route value should be either a string or a function`
    )
    if (typeof route === 'string') {
      assertRouteString(route, `${pageConfigFilePath} defines an`)
    }
    */

    const config: PageConfigData['config'] = {}
    Object.entries(configDefinitions)
      .filter(([_configName, { c_env }]) => c_env !== (isForClientSide ? 'server-only' : 'client-only'))
      .forEach(([configName, { c_env, c_code }]) => {
        const result = resolveConfigValue(configName, pageConfigFile, pageConfigFilesAbstract)
        if (!result) return
        const { pageConfigValue, pageConfigValueFilePath } = result
        const configFilePath = pageConfigValueFilePath
        const codeFilePath = getCodeFilePath(pageConfigValue, pageConfigValueFilePath, userRootDir, configName, c_code)
        assert(codeFilePath || !c_code)
        if (!codeFilePath) {
          config[configName] = {
            configFilePath,
            c_env,
            configValue: pageConfigValue
          }
        } else {
          assertUsage(
            typeof pageConfigValue === 'string',
            `${getErrorIntro(
              pageConfigFilePath,
              configName
            )} to a value with a wrong type \`${typeof pageConfigValue}\`: it should be a string instead`
          )
          config[configName] = {
            configFilePath,
            codeFilePath,
            c_env
          }
        }
      })

    pageConfigs.push({
      pageConfigFilePath,
      pageId2,
      routeFilesystem,
      config
    })
  })

  return { pageConfigs, pageConfigGlobal }
}

function serializePageConfigs(pageConfigs: PageConfigData[], pageConfigGlobal: PageConfigGlobal): string {
  const lines: string[] = []
  const importStatements: string[] = []

  lines.push('export const pageConfigs = [];')
  pageConfigs.forEach((pageConfig, i) => {
    const { pageConfigFilePath, pageId2, routeFilesystem, config } = pageConfig
    const pageConfigVar = `pageConfig${i + 1}`
    lines.push(`{`)
    lines.push(`  const ${pageConfigVar} = {`)
    lines.push(`    pageId2: '${pageId2}',`)
    lines.push(`    pageConfigFilePath: '${pageConfigFilePath}',`)
    lines.push(`    configSources: {`)
    Object.entries(config).forEach(([configName, configSource]) => {
      lines.push(`      ['${configName}']: {`)
      const { configFilePath } = configSource
      lines.push(`        configFilePath: '${configFilePath}',`)
      if ('configValue' in configSource) {
        const { configValue } = configSource
        lines.push(`        configValue: ${JSON.stringify(configValue)}`)
      } else if ('codeFilePath' in configSource) {
        const { codeFilePath, c_env } = configSource
        if (c_env !== 'routing') {
          lines.push(`        codeFilePath: '${codeFilePath}',`)
          lines.push(`        c_env: '${c_env}',`)
          lines.push(`        loadCode: () => import('${codeFilePath}')`)
        } else {
          const { importVar, importStatement } = generateEagerImport(codeFilePath)
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

function resolveConfigValue(
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
  {
    const invalidExports = Object.keys(pageConfigFileExports).filter((e) => e !== 'default')
    const invalidExportsStr = invalidExports.join(', ')
    const verb = invalidExports.length === 1 ? 'is' : 'are'
    assertUsage(
      invalidExports.length === 0,
      `${pageConfigFilePath} has \`export { ${invalidExportsStr} }\` which ${verb} forbidden: it should have a single \`export default\` instead`
    )
  }
  assertUsage('default' in pageConfigFileExports, `${pageConfigFilePath} should have a \`export default\``)
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
  assertConfigValue(configValue, pageConfigFilePath, codeFilePath, fileExists, configName)

  // Make relative to userRootDir
  codeFilePath = getVitePathFromAbsolutePath(codeFilePath, userRootDir)

  assert(fileExists)
  assertPosixPath(codeFilePath)
  assert(codeFilePath.startsWith('/'))
  return codeFilePath
}

function assertConfigValue(
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
  assert(root.startsWith('/'))
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
