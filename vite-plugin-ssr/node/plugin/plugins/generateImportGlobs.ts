export { generateImportGlobs }

import { writeFileSync } from 'fs'
import type { Plugin } from 'vite'
import { getRoot, assert } from '../utils'
import { getGlobPath } from '../glob'

function generateImportGlobs(getGlobRoots: (root: string) => Promise<string[]>): Plugin {
  return {
    name: 'vite-plugin-ssr:generateImportGlobs',
    async configResolved(config) {
      const { command } = config
      assert(command === 'serve' || command === 'build')
      const isBuild = command === 'build'
      const root = getRoot(config)
      const globRoots = await getGlobRoots(root)
      writeImportGlobs(globRoots, isBuild)
    },
  } as Plugin
}

function writeImportGlobs(globRoots: string[], isBuild: boolean) {
  // Current directory: node_modules/vite-plugin-ssr/dist/cjs/node/plugin/plugins/generateImportGlobs.js
  writeFileSync(
    require.resolve('../../../../../dist/esm/node/page-files/pageFiles.js'),
    getFileContent(globRoots, isBuild, false),
  )
  writeFileSync(
    require.resolve('../../../../../dist/esm/client/page-files/pageFiles.js'),
    getFileContent(globRoots, isBuild, true),
  )
}

function getFileContent(globRoots: string[], isBuild: boolean, isForClientSide: boolean) {
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
