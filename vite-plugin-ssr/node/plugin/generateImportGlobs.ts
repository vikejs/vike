export { generateImportGlobs }

import { writeFileSync } from 'fs'
import type { Plugin } from 'vite'
import { getRoot } from './utils/getRoot'
import { getGlobPath } from './glob'
import { assert } from '../utils'

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
  // Current directory: node_modules/vite-plugin-ssr/dist/cjs/node/plugin/generateImportGlobs.js
  writeFileSync(
    require.resolve('../../../../dist/esm/node/page-files/pageFiles.js'),
    getFileContent(globRoots, isBuild, false),
  )
  writeFileSync(
    require.resolve('../../../../dist/esm/client/page-files/pageFiles.js'),
    getFileContent(globRoots, isBuild, true),
  )
}

function getFileContent(globRoots: string[], isBuild: boolean, isForClientSide: boolean) {
  let fileContent = `// This file was generatead by \`node/plugin/generateImportGlobs.ts\`.

export const pageFilesLazy = {};
export const pageFilesEager = {};
export const pageFilesMetaLazy = {};
export const pageFilesMetaEager = {};
export const isGeneratedFile = true;

`

  fileContent += [
    getGlobs(globRoots, isBuild, 'pageIsomorphicFiles', 'page', { isMeta: false }),
    getGlobs(globRoots, isBuild, 'pageRouteFiles', 'page.route', { isMeta: false }),
  ].join('\n')
  if (isForClientSide) {
    fileContent += [
      getGlobs(globRoots, isBuild, 'pageClientFiles', 'page.client', { isMeta: false }),
      getGlobs(globRoots, isBuild, 'pageClientFilesMeta', 'page.client', { isMeta: true, appendMetaModifier: true }),
      getGlobs(globRoots, isBuild, 'pageServerFilesMeta', 'page.server', { isMeta: true }),
    ].join('\n')
  } else {
    fileContent += [
      getGlobs(globRoots, isBuild, 'pageServerFiles', 'page.server', { isMeta: false }),
      getGlobs(globRoots, isBuild, 'pageClientFilesMeta', 'page.client', { isMeta: true }),
    ].join('\n')
  }

  fileContent += '\n'

  return fileContent
}

function getGlobs(
  globRoots: string[],
  isBuild: boolean,
  varName: string,
  fileSuffix: 'page' | 'page.client' | 'page.server' | 'page.route',
  { isMeta, appendMetaModifier }: { isMeta: boolean; appendMetaModifier?: true },
): string {
  // Waiting on Vite to implement custom modifier support
  {
    if (appendMetaModifier) {
      return ''
    }
  }

  const isEager = isMeta && isBuild

  let pageFilesVar: 'pageFilesLazy' | 'pageFilesEager' | 'pageFilesMetaLazy' | 'pageFilesMetaEager'
  if (!isMeta) {
    if (!isEager) {
      pageFilesVar = 'pageFilesLazy'
    } else {
      pageFilesVar = 'pageFilesEager'
    }
  } else {
    if (!isEager) {
      pageFilesVar = 'pageFilesMetaLazy'
    } else {
      pageFilesVar = 'pageFilesMetaEager'
    }
  }

  const varNameLocals: string[] = []
  return [
    ...globRoots.map((globRoot, i) => {
      const varNameLocal = `${varName}${i + 1}`
      varNameLocals.push(varNameLocal)
      const globPath = `'${getGlobPath(globRoot, fileSuffix)}'`
      const mod = !appendMetaModifier ? '' : ", { as: 'meta' }"
      return `const ${varNameLocal} = import.meta.glob${isEager ? 'Eager' : ''}(${globPath}${mod});`
    }),
    `const ${varName} = {${varNameLocals.map((varNameLocal) => `...${varNameLocal}`).join(',')}};`,
    `${pageFilesVar}}['.${fileSuffix}'] = ${varName}`,
  ].join('\n')
}
