export { getVirtualFileImportUserCode }

// TODO/v1-release:
//  - Remove this file
//    - Instead only generate getVirtualFilePageConfigs()
//  - Remove old `.page.js`/`.page.client.js`/`.page.server.js` interface
//    - Systematically remove all pageFilesAll references does the trick?

import type { ResolvedConfig } from 'vite'
import {
  assert,
  assertPosixPath,
  viteIsSSR_options,
  scriptFileExtensions,
  debugGlob,
  getOutDirs,
  isVersionOrAbove
} from '../../utils.js'
import type { ConfigVikeResolved } from '../../../../shared/ConfigVike.js'
import { isVirtualFileIdImportUserCode } from '../../../shared/virtual-files/virtualFileImportUserCode.js'
import { version as viteVersion } from 'vite'
import { type FileType, fileTypes } from '../../../../shared/getPageFiles/fileTypes.js'
import path from 'path'
import { getVirtualFilePageConfigs } from './v1-design/getVirtualFilePageConfigs.js'

type GlobRoot = {
  includeDir: string // slash-terminated
  excludeDir?: string // slash-terminated, no leading exclamation mark
}

async function getVirtualFileImportUserCode(
  id: string,
  options: { ssr?: boolean } | undefined,
  configVike: ConfigVikeResolved,
  config: ResolvedConfig,
  isDev: boolean
) {
  const idParsed = isVirtualFileIdImportUserCode(id)
  assert(idParsed)
  const { isForClientSide, isClientRouting } = idParsed
  assert(isForClientSide === !viteIsSSR_options(options))
  const isPrerendering = !!configVike.prerender
  const code = await getCode(config, configVike, isForClientSide, isClientRouting, isPrerendering, isDev, id)
  return code
}

async function getCode(
  config: ResolvedConfig,
  configVike: ConfigVikeResolved,
  isForClientSide: boolean,
  isClientRouting: boolean,
  isPrerendering: boolean,
  isDev: boolean,
  id: string
) {
  const { command } = config
  assert(command === 'serve' || command === 'build')
  const isBuild = command === 'build'
  assert(isDev === !isBuild)
  let content = ''
  {
    const globRoots = getGlobRoots(config)
    debugGlob('Glob roots: ', globRoots)
    content += await generateGlobImports(
      globRoots,
      isBuild,
      isForClientSide,
      isClientRouting,
      configVike,
      isPrerendering,
      config,
      isDev,
      id
    )
  }
  debugGlob(`Glob imports for ${isForClientSide ? 'client' : 'server'}:\n`, content)
  return content
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

async function generateGlobImports(
  globRoots: GlobRoot[],
  isBuild: boolean,
  isForClientSide: boolean,
  isClientRouting: boolean,
  configVike: ConfigVikeResolved,
  isPrerendering: boolean,
  config: ResolvedConfig,
  isDev: boolean,
  id: string
) {
  let fileContent = `// Generatead by node/plugin/plugins/virtualFiles/index.ts

export const pageFilesLazy = {};
export const pageFilesEager = {};
export const pageFilesExportNamesLazy = {};
export const pageFilesExportNamesEager = {};
export const pageFilesList = [];
export const neverLoaded = {};
export const isGeneratedFile = true;

${await getVirtualFilePageConfigs(isForClientSide, isDev, id, isClientRouting, config)}

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
        fileContent += getGlobs(globRoots, isBuild, fileType)
      }
      if (includeExportNames) {
        fileContent += getGlobs(globRoots, isBuild, fileType, 'extractExportNames')
      }
    })
  if (configVike.includeAssetsImportedByServer && isForClientSide) {
    fileContent += getGlobs(globRoots, isBuild, '.page.server', 'extractAssets')
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
  globRoots: GlobRoot[],
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
    ...globRoots.map((globRoot, i) => {
      const varNameLocal = `${varName}${i + 1}`
      varNameLocals.push(varNameLocal)
      const globIncludePath = `'${getGlobPath(globRoot.includeDir, fileType)}'`
      const globExcludePath = globRoot.excludeDir ? `'!${getGlobPath(globRoot.excludeDir, fileType)}'` : null
      const globOptions: Record<string, unknown> = { eager: isEager }
      if (isVersionOrAbove(viteVersion, '5.1.0')) {
        globOptions.query = `?${query}`
      } else {
        globOptions.as = query
      }
      const globPaths = globExcludePath ? `[${globIncludePath}, ${globExcludePath}]` : `[${globIncludePath}]`
      const globLine = `const ${varNameLocal} = import.meta.glob(${globPaths}, ${JSON.stringify(globOptions)});`
      return globLine
    }),
    `const ${varName} = {${varNameLocals.map((varNameLocal) => `...${varNameLocal}`).join(',')}};`,
    `${pageFilesVar}['${fileType}'] = ${varName};`,
    ''
  ].join('\n')
}

function getGlobRoots(config: ResolvedConfig): GlobRoot[] {
  const globRoots: GlobRoot[] = [
    {
      includeDir: '/',
      excludeDir: path.posix.relative(config.root, getOutDirs(config).outDirRoot)
    }
  ]
  return globRoots
}

function getGlobPath(globRootDir: string, fileType: FileType): string {
  assertPosixPath(globRootDir)
  let globPath = [...globRootDir.split('/'), '**', `*${fileType}.${scriptFileExtensions}`].filter(Boolean).join('/')
  if (!globPath.startsWith('/')) {
    globPath = '/' + globPath
  }
  return globPath
}
