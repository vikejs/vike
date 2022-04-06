export { generateImportGlobs }

import type { Plugin, ResolvedConfig } from 'vite'
import { assert, isSSR_options } from '../utils'
import { getGlobPath } from './generateImportGlobs/getGlobPath'
import { getGlobRoots } from './generateImportGlobs/getGlobRoots'
import { assertVitePluginSsrConfig } from './config/VitePluginSsrConfig'

const moduleIds = ['virtual:vite-plugin-ssr:pageFiles:server', 'virtual:vite-plugin-ssr:pageFiles:client']

function generateImportGlobs(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'vite-plugin-ssr:virtualModulePageFiles',
    async configResolved(config_) {
      config = config_
    },
    resolveId(id) {
      if (moduleIds.includes(id)) {
        return id
      }
    },
    async load(id, options) {
      if (moduleIds.includes(id)) {
        const isForClientSide = id === moduleIds[1]
        assert(isForClientSide === !isSSR_options(options))
        const code = await getCode(config, isForClientSide)
        return code
      }
    },
  } as Plugin
}

async function getCode(config: ResolvedConfig, isForClientSide: boolean) {
  const { command } = config
  assert(command === 'serve' || command === 'build')
  const isBuild = command === 'build'
  assertVitePluginSsrConfig(config)
  const globRoots = await getGlobRoots(config)
  const content = getContent(globRoots, isBuild, isForClientSide)
  return content
}

function getContent(globRoots: string[], isBuild: boolean, isForClientSide: boolean) {
  let fileContent = `// This file was generatead by \`node/plugin/plugins/generateImportGlobs.ts\`.

export const pageFilesLazy = {};
export const pageFilesEager = {};
export const pageFilesExportNamesLazy = {};
export const pageFilesExportNamesEager = {};
export const neverLoaded = {};
export const isGeneratedFile = true;

`

  fileContent += [getGlobs(globRoots, isBuild, 'page'), getGlobs(globRoots, isBuild, 'page.route'), ''].join('\n')
  if (isForClientSide) {
    fileContent += [
      getGlobs(globRoots, isBuild, 'page.client'),
      getGlobs(globRoots, isBuild, 'page.client', 'extractExportNames'),
      getGlobs(globRoots, isBuild, 'page.server', 'extractExportNames'),
      getGlobs(globRoots, isBuild, 'page', 'extractExportNames'),
      getGlobs(globRoots, isBuild, 'page.server', 'extractStyles'),
    ].join('\n')
  } else {
    fileContent += [
      getGlobs(globRoots, isBuild, 'page.server'),
      getGlobs(globRoots, isBuild, 'page.client', 'extractExportNames'),
    ].join('\n')
  }

  return fileContent
}

function getGlobs(
  globRoots: string[],
  isBuild: boolean,
  fileSuffix: 'page' | 'page.client' | 'page.server' | 'page.route',
  query: 'extractExportNames' | 'extractStyles' | '' = '',
): string {
  const isEager = isBuild && (query === 'extractExportNames' || fileSuffix === 'page.route')

  let pageFilesVar:
    | 'pageFilesLazy'
    | 'pageFilesEager'
    | 'pageFilesExportNamesLazy'
    | 'pageFilesExportNamesEager'
    | 'neverLoaded'
  if (query === 'extractExportNames') {
    if (!isEager) {
      pageFilesVar = 'pageFilesExportNamesLazy'
    } else {
      pageFilesVar = 'pageFilesExportNamesEager'
    }
  } else if (query === 'extractStyles') {
    assert(!isEager)
    pageFilesVar = 'neverLoaded'
  } else {
    if (!isEager) {
      pageFilesVar = 'pageFilesLazy'
    } else {
      pageFilesVar = 'pageFilesEager'
    }
  }

  const varNameSuffix =
    (fileSuffix === 'page' && 'Isomorph') ||
    (fileSuffix === 'page.client' && 'Client') ||
    (fileSuffix === 'page.server' && 'Server') ||
    (fileSuffix === 'page.route' && 'Route')
  assert(varNameSuffix)
  const varName = `${pageFilesVar}${varNameSuffix}`

  const varNameLocals: string[] = []
  return [
    ...globRoots.map((globRoot, i) => {
      const varNameLocal = `${varName}${i + 1}`
      varNameLocals.push(varNameLocal)
      const globPath = `'${getGlobPath(globRoot, fileSuffix)}'`
      const globOptions = `{ eager: ${isEager ? true : false}, query: "${query}" }`
      return `const ${varNameLocal} = import.meta.importGlob(${globPath}, ${globOptions});`
    }),
    `const ${varName} = {${varNameLocals.map((varNameLocal) => `...${varNameLocal}`).join(',')}};`,
    `${pageFilesVar}['.${fileSuffix}'] = ${varName};`,
    '',
  ].join('\n')
}
