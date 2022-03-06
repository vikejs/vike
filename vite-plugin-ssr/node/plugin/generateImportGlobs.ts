export { generateImportGlobs }

import { writeFileSync } from 'fs'
import type { Plugin } from 'vite'
import { getRoot } from './utils/getRoot'
import { getGlobPath } from './glob'

function generateImportGlobs(getGlobRoots: (root: string) => Promise<string[]>): Plugin {
  return {
    name: 'vite-plugin-ssr:generateImportGlobs',
    enforce: 'pre',
    async config(config) {
      const root = getRoot(config)
      const globRoots = await getGlobRoots(root)
      writeImportGlobs(globRoots)
    },
  } as Plugin
}

function writeImportGlobs(globRoots: string[]) {
  const fileContent = getFileContent(globRoots)
  // Current directory: node_modules/vite-plugin-ssr/dist/cjs/node/plugin/generateImportGlobs.js
  writeFileSync(require.resolve('../../../../dist/esm/node/page-files/pageFiles.js'), fileContent)
  writeFileSync(require.resolve('../../../../dist/esm/client/page-files/pageFiles.js'), fileContent)
}

function getFileContent(globRoots: string[]) {
  const fileContent = `// This file was generatead by \`node/plugin/generateImportGlobs.ts\`.

export { pageFiles }

${getGlobs('pageIsomorphicFiles', globRoots, 'page')}
${getGlobs('pageClientFiles', globRoots, 'page.client')}
${getGlobs('pageServerFiles', globRoots, 'page.server')}
${getGlobs('pageRouteFiles', globRoots, 'page.route')}

const pageFiles = {
  isOriginalFile: false,
  '.page': pageIsomorphicFiles,
  '.page.client': pageClientFiles,
  '.page.server': pageServerFiles,
  '.page.route': pageRouteFiles,
};
`
  return fileContent
}

function getGlobs(
  varName: 'pageIsomorphicFiles' | 'pageClientFiles' | 'pageServerFiles' | 'pageRouteFiles',
  globRoots: string[],
  fileSuffix: 'page' | 'page.client' | 'page.server' | 'page.route',
): string {
  const varNameLocals: string[] = []
  return [
    ...globRoots.map((globRoot, i) => {
      const varNameLocal = `${varName}${i + 1}`
      varNameLocals.push(varNameLocal)
      return `const ${varNameLocal} = import.meta.glob('${getGlobPath(globRoot, fileSuffix)}');`
    }),
    `const ${varName} = {${varNameLocals.map((varNameLocal) => `...${varNameLocal}`).join(',')}};`,
  ].join('\n')
}
