export { generateImportGlobs }

import type { Plugin, ResolvedConfig } from 'vite'
import { assert, viteIsSSR_options, isNotNullish } from '../utils'
import { getGlobPath } from './generateImportGlobs/getGlobPath'
import { getGlobRoots } from './generateImportGlobs/getGlobRoots'
import { debugGlob } from '../../utils'
import type { ConfigVpsResolved } from './config/ConfigVps'
import { assertConfigVpsResolved } from './config/assertConfigVps'
import {
  virtualModuleIdPageFilesClientSR,
  virtualModuleIdPageFilesClientCR,
  virtualModuleIdPageFilesServer
} from './generateImportGlobs/virtualModuleIdPageFiles'
import type { FileType } from '../../../shared/getPageFiles/types'

const virtualModuleIds = [
  virtualModuleIdPageFilesServer,
  virtualModuleIdPageFilesClientSR,
  virtualModuleIdPageFilesClientCR
]

type Config = ResolvedConfig & { vitePluginSsr: ConfigVpsResolved }

function generateImportGlobs(): Plugin {
  let config: Config
  return {
    name: 'vite-plugin-ssr:virtualModulePageFiles',
    config() {
      return {
        experimental: {
          importGlobRestoreExtension: true
        }
      }
    },
    async configResolved(config_) {
      assertConfigVpsResolved(config_)
      config = config_
    },
    resolveId(id) {
      if (virtualModuleIds.includes(id)) {
        return id
      }
    },
    async load(id, options) {
      if (virtualModuleIds.includes(id)) {
        const isForClientSide = id !== virtualModuleIdPageFilesServer
        assert(isForClientSide === !viteIsSSR_options(options))
        const isClientRouting = id === virtualModuleIdPageFilesClientCR
        const code = await getCode(config, isForClientSide, isClientRouting)
        return code
      }
    }
  } as Plugin
}

async function getCode(config: Config, isForClientSide: boolean, isClientRouting: boolean) {
  const { command } = config
  assert(command === 'serve' || command === 'build')
  const isBuild = command === 'build'
  const globRoots = await getGlobRoots(config)
  debugGlob('Glob roots: ', globRoots)
  let content = ''
  {
    const crawlRoots = globRoots.map((g) => g.addCrawlRoot).filter(isNotNullish)
    content += getContent(crawlRoots, isBuild, isForClientSide, isClientRouting, config)
  }
  {
    const addPageFiles = globRoots.map((g) => g.addPageFile).filter(isNotNullish)
    content += generateAddPageFileImports(addPageFiles)
  }
  debugGlob('Glob imports: ', content)
  return content
}

function generateAddPageFileImports(addPageFiles: string[]) {
  let fileContent = '\n\n'
  addPageFiles.forEach((importPath) => {
    const fileType = getFileType(importPath)
    assert(fileType !== '.page.route') // Populate `pageFilesEager` instead of `pageFilesLazy`
    fileContent += `pageFilesLazy['${fileType}']['${importPath}'] = () => import('${importPath}'); `
    fileContent += '\n'
  })
  return fileContent
}

function getFileType(filePath: string): FileType {
  let fileType: FileType | undefined
  if (filePath.includes('.page.route.')) {
    assert(!fileType)
    fileType = '.page.route'
  }
  if (filePath.includes('.page.client.')) {
    assert(!fileType)
    fileType = '.page.client'
  }
  if (filePath.includes('.page.server.')) {
    assert(!fileType)
    fileType = '.page.server'
  }
  if (!fileType) {
    assert(filePath.includes('.page.'))
    fileType = '.page'
  }
  return fileType
}

function getContent(
  crawlRoots: string[],
  isBuild: boolean,
  isForClientSide: boolean,
  isClientRouting: boolean,
  config: Config
) {
  let fileContent = `// This file was generatead by \`node/plugin/plugins/generateImportGlobs.ts\`.

export const pageFilesLazy = {};
export const pageFilesEager = {};
export const pageFilesExportNamesLazy = {};
export const pageFilesExportNamesEager = {};
export const neverLoaded = {};
export const isGeneratedFile = true;

`

  fileContent += getGlobs(crawlRoots, isBuild, 'page')
  if (!isForClientSide || isClientRouting) {
    fileContent += '\n' + getGlobs(crawlRoots, isBuild, 'page.route')
  }
  fileContent += '\n'

  if (isForClientSide) {
    fileContent += [
      getGlobs(crawlRoots, isBuild, 'page.client'),
      getGlobs(crawlRoots, isBuild, 'page.client', 'extractExportNames'),
      getGlobs(crawlRoots, isBuild, 'page.server', 'extractExportNames'),
      getGlobs(crawlRoots, isBuild, 'page', 'extractExportNames')
    ].join('\n')
    if (config.vitePluginSsr.includeAssetsImportedByServer) {
      fileContent += getGlobs(crawlRoots, isBuild, 'page.server', 'extractAssets')
    }
  } else {
    fileContent += [
      getGlobs(crawlRoots, isBuild, 'page.server'),
      getGlobs(crawlRoots, isBuild, 'page.client', 'extractExportNames')
    ].join('\n')
    if (isBuild && config.vitePluginSsr.prerender) {
      // We extensively use `PageFile['exportNames']` while pre-rendering, in order to avoid loading page files unnecessarily, and therefore reducing memory usage.
      fileContent += [
        getGlobs(crawlRoots, true, 'page', 'extractExportNames'),
        getGlobs(crawlRoots, true, 'page.server', 'extractExportNames')
      ].join('\n')
    }
  }

  return fileContent
}

function getGlobs(
  crawlRoots: string[],
  isBuild: boolean,
  fileSuffix: 'page' | 'page.client' | 'page.server' | 'page.route',
  query?: 'extractExportNames' | 'extractAssets'
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
  } else if (query === 'extractAssets') {
    assert(!isEager)
    pageFilesVar = 'neverLoaded'
  } else if (!query) {
    if (!isEager) {
      pageFilesVar = 'pageFilesLazy'
    } else {
      // Used for `.page.route.js` files
      pageFilesVar = 'pageFilesEager'
    }
  } else {
    assert(false)
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
    ...crawlRoots.map((globRoot, i) => {
      const varNameLocal = `${varName}${i + 1}`
      varNameLocals.push(varNameLocal)
      const globPath = `'${getGlobPath(globRoot, fileSuffix)}'`
      const globOptions = JSON.stringify({ eager: isEager, as: query })
      assert(globOptions.startsWith('{"eager":true') || globOptions.startsWith('{"eager":false'))
      const globLine = `const ${varNameLocal} = import.meta.glob(${globPath}, ${globOptions});`
      return globLine
    }),
    `const ${varName} = {${varNameLocals.map((varNameLocal) => `...${varNameLocal}`).join(',')}};`,
    `${pageFilesVar}['.${fileSuffix}'] = ${varName};`,
    ''
  ].join('\n')
}
