export { generateImportGlobs }

import type { Plugin, ResolvedConfig } from 'vite'
import { assert, assertPosixPath, viteIsSSR_options, isNotNullish, scriptFileExtensions } from '../utils'
import { debugGlob } from '../../utils'
import type { ConfigVpsResolved } from './config/ConfigVps'
import { getConfigVps } from './config/assertConfigVps'
import {
  virtualModuleIdPageFilesClientSR,
  virtualModuleIdPageFilesClientCR,
  virtualModuleIdPageFilesServer
} from './generateImportGlobs/virtualModuleIdPageFiles'
import { type FileType, fileTypes, isValidFileType } from '../../../shared/getPageFiles/fileTypes'
import path from 'path'

const virtualModuleIds = [
  virtualModuleIdPageFilesServer,
  virtualModuleIdPageFilesClientSR,
  virtualModuleIdPageFilesClientCR
]

function generateImportGlobs(): Plugin {
  let config: ResolvedConfig
  let configVps: ConfigVpsResolved
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
      configVps = await getConfigVps(config_)
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
        const isPrerendering = !!configVps.prerender
        const code = await getCode(config, configVps, isForClientSide, isClientRouting, isPrerendering)
        return code
      }
    }
  } as Plugin
}

async function getCode(
  config: ResolvedConfig,
  configVps: ConfigVpsResolved,
  isForClientSide: boolean,
  isClientRouting: boolean,
  isPrerendering: boolean
) {
  const { command } = config
  assert(command === 'serve' || command === 'build')
  const isBuild = command === 'build'
  let content = ''
  {
    const globRoots = getGlobRoots(config, configVps)
    debugGlob('Glob roots: ', globRoots)
    content += generateGlobImports(globRoots, isBuild, isForClientSide, isClientRouting, configVps, isPrerendering)
  }
  {
    const extensionsImportPaths = configVps.extensions
      .map(({ pageFilesDist }) => pageFilesDist)
      .flat()
      .filter(isNotNullish)
      .map(({ importPath }) => importPath)
    content += generateExtensionImports(
      extensionsImportPaths,
      isForClientSide,
      isBuild,
      isClientRouting,
      isPrerendering
    )
  }
  debugGlob(`Glob imports for ${isForClientSide ? 'client' : 'server'}:\n`, content)
  return content
}

function generateExtensionImports(
  extensionsImportPaths: string[],
  isForClientSide: boolean,
  isBuild: boolean,
  isClientRouting: boolean,
  isPrerendering: boolean
) {
  let fileContent = '\n\n'
  extensionsImportPaths.forEach((importPath) => {
    const fileType = getFileType(importPath)
    const { includeImport, includeExportNames } = determineInjection({
      fileType,
      isForClientSide,
      isClientRouting,
      isPrerendering,
      isBuild
    })
    if (includeImport) {
      fileContent += addImport(importPath, fileType, false, isBuild)
    }
    if (includeExportNames) {
      fileContent += addImport(importPath, fileType, true, isBuild)
    }
    if (!includeImport && !includeExportNames && !isForClientSide) {
      fileContent += `pageFilesList.push("${importPath}");` + '\n'
    }
  })
  return fileContent
}

function determineInjection({
  fileType,
  isForClientSide,
  isClientRouting,
  isPrerendering,
  isBuild
}: {
  fileType: FileType
  isForClientSide: boolean
  isClientRouting: boolean
  isPrerendering: boolean
  isBuild: boolean
}): { includeImport: boolean; includeExportNames: boolean } {
  if (!isForClientSide) {
    return {
      includeImport: fileType === '.page.server' || fileType === '.page' || fileType === '.page.route',
      includeExportNames:
        isPrerendering && isBuild
          ? fileType === '.page.client' || fileType === '.page.server' || fileType === '.page' // We extensively use `PageFile['exportNames']` while pre-rendering, in order to avoid loading page files unnecessarily, and therefore reducing memory usage.
          : fileType === '.page.client'
    }
  } else {
    const includeImport = fileType === '.page.client' || fileType === '.css' || fileType === '.page'
    if (!isClientRouting) {
      return {
        includeImport,
        includeExportNames: false
      }
    } else {
      return {
        includeImport: includeImport || fileType === '.page.route',
        includeExportNames: fileType === '.page.client' || fileType === '.page.server' || fileType === '.page'
      }
    }
  }
}

let varCounter = 0
function addImport(importPath: string, fileType: FileType, exportNames: boolean, isBuild: boolean): string {
  const pageFilesVar: PageFileVar = (() => {
    if (exportNames) {
      if (isBuild) {
        return 'pageFilesExportNamesEager'
      } else {
        return 'pageFilesExportNamesLazy'
      }
    } else {
      if (fileType === '.page.route') {
        return 'pageFilesEager'
      } else {
        return 'pageFilesLazy'
      }
    }
  })()
  const query = !exportNames ? '' : '?extractExportNames'

  let fileContent = ''
  const mapVar = `${pageFilesVar}['${fileType}']`
  fileContent += `${mapVar} = ${mapVar} ?? {};\n`
  const value = (() => {
    if (!pageFilesVar.endsWith('Eager')) {
      return `() => import('${importPath}${query}')`
    } else {
      const importVar = `__import_${varCounter++}`
      fileContent += `import * as ${importVar} from '${importPath}${query}';\n`
      return importVar
    }
  })()
  fileContent += `${mapVar}['${importPath}'] = ${value};\n`

  return fileContent
}

function getFileType(filePath: string): FileType {
  // TODO: move to fileTypes.ts
  assert(isValidFileType(filePath), { filePath })
  if (filePath.endsWith('.css')) {
    return '.css'
  }
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

function generateGlobImports(
  crawlRoots: string[], // TODO: rename to globRoots
  isBuild: boolean,
  isForClientSide: boolean,
  isClientRouting: boolean,
  configVps: ConfigVpsResolved,
  isPrerendering: boolean
) {
  let fileContent = `// Generatead by \`node/plugin/plugins/generateImportGlobs.ts\`.

export const pageFilesLazy = {};
export const pageFilesEager = {};
export const pageFilesExportNamesLazy = {};
export const pageFilesExportNamesEager = {};
export const pageFilesList = [];
export const neverLoaded = {};
export const isGeneratedFile = true;

`

  fileTypes
    .filter((fileType) => fileType !== '.css')
    .forEach((fileType) => {
      assert(fileType !== '.css')
      const { includeImport, includeExportNames } = determineInjection({
        fileType,
        isForClientSide,
        isClientRouting,
        isPrerendering,
        isBuild
      })
      if (includeImport) {
        fileContent += getGlobs(crawlRoots, isBuild, fileType)
      }
      if (includeExportNames) {
        fileContent += getGlobs(crawlRoots, isBuild, fileType, 'extractExportNames')
      }
    })
  if (configVps.includeAssetsImportedByServer && isForClientSide) {
    fileContent += getGlobs(crawlRoots, isBuild, '.page.server', 'extractAssets')
  }

  return fileContent
}

type PageFileVar =
  | 'pageFilesLazy'
  | 'pageFilesEager'
  | 'pageFilesExportNamesLazy'
  | 'pageFilesExportNamesEager'
  | 'neverLoaded'

function getGlobs(
  crawlRoots: string[],
  isBuild: boolean,
  fileType: Exclude<FileType, '.css'>,
  query?: 'extractExportNames' | 'extractAssets'
): string {
  const isEager = isBuild && (query === 'extractExportNames' || fileType === '.page.route')

  let pageFilesVar: PageFileVar
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
    (fileType === '.page' && 'Isomorph') ||
    (fileType === '.page.client' && 'Client') ||
    (fileType === '.page.server' && 'Server') ||
    (fileType === '.page.route' && 'Route')
  assert(varNameSuffix)
  const varName = `${pageFilesVar}${varNameSuffix}`

  const varNameLocals: string[] = []
  return [
    ...crawlRoots.map((globRoot, i) => {
      const varNameLocal = `${varName}${i + 1}`
      varNameLocals.push(varNameLocal)
      const globPath = `'${getGlobPath(globRoot, fileType)}'`
      const globOptions = JSON.stringify({ eager: isEager, as: query })
      assert(globOptions.startsWith('{"eager":true') || globOptions.startsWith('{"eager":false'))
      const globLine = `const ${varNameLocal} = import.meta.glob(${globPath}, ${globOptions});`
      return globLine
    }),
    `const ${varName} = {${varNameLocals.map((varNameLocal) => `...${varNameLocal}`).join(',')}};`,
    `${pageFilesVar}['${fileType}'] = ${varName};`,
    ''
  ].join('\n')
}

function getGlobRoots(config: ResolvedConfig, configVps: ConfigVpsResolved): string[] {
  const globRoots = ['/']
  configVps.extensions
    .map(({ pageFilesSrc }) => pageFilesSrc)
    .filter(isNotNullish)
    .forEach((pageFilesSrc) => {
      const globRoot = path.posix.relative(config.root, pageFilesSrc)
      globRoots.push(globRoot)
    })
  return globRoots
}

function getGlobPath(globRoot: string, fileType: FileType): string {
  assertPosixPath(globRoot)
  let globPath = [...globRoot.split('/'), '**', `*${fileType}.${scriptFileExtensions}`].filter(Boolean).join('/')
  if (!globPath.startsWith('/')) {
    globPath = '/' + globPath
  }
  return globPath
}
