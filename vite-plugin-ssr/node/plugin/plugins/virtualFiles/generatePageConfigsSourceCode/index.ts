export { generatePageConfigsSourceCode }
export { generatePageConfigVirtualFile }

import { assert } from '../../../utils'

import type { PageConfigData, PageConfigGlobal } from '../../../../../shared/page-configs/PageConfig'
import { generateEagerImport } from '../generateEagerImport'
import { loadPageConfigFiles } from './loadPageConfigFiles'
import { getPageConfigsData } from './getPageConfigsData'
import { virtualIdPageConfigCode } from './virtualIdPageConfigCode'

let pageConfigsData: null | PageConfigData[] = null

// TODO: ensure that client-side of Server Routing loads less than Client Routing
// TODO: create one virtual file per route
// TODO: if conf isn't file path then assert that it's serialazable
// TODO: use Math.random() instead of timestamp in built file + think why I had concurrent issues

async function generatePageConfigsSourceCode(
  userRootDir: string,
  isForClientSide: boolean,
  isDev: boolean
): Promise<string> {
  try {
    return await getCode(userRootDir, isForClientSide)
  } catch (err) {
    handleError(err, isDev)
    assert(false)
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

function generateSourceCodeOfPageConfigs(
  pageConfigsData: PageConfigData[],
  pageConfigGlobal: PageConfigGlobal,
  isForClientSide: boolean
): string {
  const lines: string[] = []
  const importStatements: string[] = []

  lines.push('export const pageConfigs = [];')
  pageConfigsData.forEach((pageConfig, i) => {
    const { pageConfigFilePath, pageId2, routeFilesystem, configSources, codeFilesImporter } = pageConfig
    const pageConfigVar = `pageConfig${i + 1}` // Removed outdated & unncessary variable creation
    lines.push(`{`)
    lines.push(`  const ${pageConfigVar} = {`)
    lines.push(`    pageId2: '${pageId2}',`)
    lines.push(`    pageConfigFilePath: '${pageConfigFilePath}',`)
    lines.push(`    routeFilesystem: '${routeFilesystem}',`)
    lines.push(`    codeFilesImporter: '${codeFilesImporter}',`)
    lines.push(`    loadCodeFiles: async () => (await import('${codeFilesImporter}')).default,`)
    lines.push(`    configSources: {`)
    Object.entries(configSources).forEach(([configName, configSource]) => {
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
  Object.entries(pageConfigData.configSources).forEach(([configName, configSource]) => {
    if (!configSource.codeFilePath) return
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

function handleError(err: unknown, isDev: boolean) {
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
