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

import type { c_Env, PageConfig2 } from '../../../../shared/page-configs/PageConfig'
import { loadPageConfigFiles, PageConfigFile } from '../../helpers'
import { assertRouteString } from '../../../../shared/route/resolveRouteString'

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
    return 'export const pageConfigs = null;'
  }
  const { pageConfigFiles } = result
  const { pageConfigs } = getPageConfigs(pageConfigFiles, userRootDir, isForClientSide)
  return serializePageConfigs(pageConfigs)
}

function getPageConfigs(pageConfigFiles: PageConfigFile[], userRootDir: string, isForClientSide: boolean) {
  // const pageConfigGlobal = {}
  const pageConfigs: PageConfig2[] = []

  const pageConfigFilesAbstract = pageConfigFiles.filter((p) => isAbstract(p))
  const pageConfigFilesConcrete = pageConfigFiles.filter((p) => !isAbstract(p))
  pageConfigFilesConcrete.forEach((pageConfigFile) => {
    const { pageConfigFilePath } = pageConfigFile
    const pageConfigValues = getPageConfigValues(pageConfigFile)
    const pageId2 = determinePageId2(pageConfigFilePath)

    const route: unknown = pageConfigValues.route || determineRouteFromFilesystemPath(pageConfigFilePath)
    assertUsage(
      typeof route === 'string' || isCallable(route),
      `${pageConfigFilePath} sets the config route to a value with an invalid type \`${typeof route}\`: the route value should be either a string or a function`
    )
    if (typeof route === 'string') {
      assertRouteString(route, `${pageConfigFilePath} defines an`)
    }

    const configSources: PageConfig2['configSources'] = {}
    Object.entries(configDefinitions)
      .filter(([_configName, { c_env }]) => c_env !== (isForClientSide ? 'server-only' : 'client-only'))
      .forEach(([configName, { c_code, c_env }]) => {
        const result = resolveConfigValue(configName, pageConfigFile, pageConfigFilesAbstract)
        if (!result) return
        const { pageConfigValue, pageConfigValueFilePath } = result
        if (!c_code) {
          configSources[configName] = {
            configFilePath: pageConfigValueFilePath,
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
          const codeFilePath = resolveCodeFilePath(pageConfigValue, pageConfigValueFilePath, userRootDir, configName)
          configSources[configName] = {
            codeFilePath,
            c_env
          }
        }
      })

    pageConfigs.push({
      pageConfigFilePath,
      pageId2,
      route,
      configSources
    })
  })

  return { pageConfigs }
}

function serializePageConfigs(pageConfigs: PageConfig2[]): string {
  const lines: string[] = []

  lines.push('export const pageConfigs = [];')

  pageConfigs.forEach((pageConfig) => {
    const { pageConfigFilePath, pageId2, route, configSources } = pageConfig
    lines.push('pageConfigs.push({')
    lines.push(`  pageId2: '${pageId2}',`)
    lines.push(`  route: '${route}',`)
    lines.push(`  pageConfigFilePath: '${pageConfigFilePath}',`)
    lines.push(`  configSources: {`)
    Object.entries(configSources).forEach(([configName, configSource]) => {
      lines.push(`    ['${configName}']: {`)
      if ('codeFilePath' in configSource) {
        const { codeFilePath, c_env } = configSource
        lines.push(`      codeFilePath: '${codeFilePath}',`)
        lines.push(`      c_env: '${c_env}',`)
        lines.push(`      loadCode: () => import('${codeFilePath}')`)
      } else {
        const { configFilePath, configValue } = configSource
        lines.push(`      configFilePath: '${configFilePath}',`)
        lines.push(`      configValue: ${JSON.stringify(configValue)}`)
      }
      lines.push(`    },`)
    })
    lines.push(`  }`)
    lines.push('});')
  })

  const code = lines.join('\n')
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

function resolveCodeFilePath(
  configValue: string,
  pageConfigFilePath: string,
  userRootDir: string,
  configName: string
): string {
  const errIntro1 = `${getErrorIntro(pageConfigFilePath, configName)} to the value '${configValue}'`
  const errIntro2 = `${errIntro1} but the value should be`
  const warnArgs = { onlyOnce: true, showStackTrace: false } as const

  if (!isPosixPath(configValue)) {
    assert(configValue.includes('\\'))
    const configValueFixed = toPosixPath(configValue)
    assert(!configValue.includes('\\'))
    assertWarning(
      false,
      `${errIntro2} '${configValueFixed}' instead (replace backslashes '\\' with forward slahes '/')`,
      warnArgs
    )
    configValue = configValueFixed
  }

  let codeFilePath: string
  {
    const pageConfigDir = dirnameNormalized(pageConfigFilePath)
    if (configValue.startsWith('/')) {
      assertWarning(
        false,
        `${errIntro2} a relative path instead (i.e. a path that starts with './' or '../') that is relative to ${pageConfigDir}`,
        warnArgs
      )
      codeFilePath = configValue
    } else {
      assertPosixPath(configValue)
      assertPosixPath(pageConfigFilePath)
      codeFilePath = path.posix.join(pageConfigDir, configValue)
    }
  }

  assertPosixPath(userRootDir)
  assertPosixPath(codeFilePath)
  let codeFilePathAbsolute = path.posix.join(userRootDir, codeFilePath)
  const clean = addFileExtensionsToRequireResolve()
  try {
    codeFilePathAbsolute = require.resolve(codeFilePathAbsolute)
  } catch {
    assertUsage(false, `${errIntro1} but no file was found at ${codeFilePathAbsolute}`)
  } finally {
    clean()
  }
  codeFilePathAbsolute = toPosixPath(codeFilePathAbsolute)

  {
    // It's not possible to omit '../' so we can assume that the path is relative to pageConfigDir
    const configValueFixed = './' + configValue
    assertWarning(
      [
        './',
        '../',
        // Warning for `/` already handled above
        '/'
      ].some((prefix) => configValue.startsWith(prefix)),
      `${errIntro2} '${configValueFixed}' instead (make sure to prefix paths with './' or '../')`,
      warnArgs
    )
  }
  {
    const filename = path.posix.basename(codeFilePathAbsolute)
    const configValueDir = dirnameNormalized(configValue)
    const configValueFixed = configValueDir + filename
    const fileExt = path.posix.extname(filename)
    assertWarning(
      configValue.endsWith(filename),
      `${errIntro2} '${configValueFixed}' instead (don't omit the file extension '${fileExt}')`,
      warnArgs
    )
  }

  assert(codeFilePath.startsWith('/'))
  return codeFilePath
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
