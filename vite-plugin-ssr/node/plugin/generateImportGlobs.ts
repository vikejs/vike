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
  // Current directory: node_modules/vite-plugin-ssr/dist/cjs/node/plugin/generateImportGlobs.js
  writeFileSync(require.resolve('../../../../dist/esm/node/page-files/pageFiles.js'), getFileContent(globRoots, false))
  writeFileSync(require.resolve('../../../../dist/esm/client/page-files/pageFiles.js'), getFileContent(globRoots, true))
}

function getFileContent(globRoots: string[], isForClientSide: boolean) {
  const fileContent = `// This file was generatead by \`node/plugin/generateImportGlobs.ts\`.

export const pageFiles = {};
export const pageFilesMeta = {};
export const isGeneratedFile = true;

${getGlobs('pageIsomorphicFiles', globRoots, 'page', false)}
${getGlobs('pageClientFiles', globRoots, 'page.client', !isForClientSide)}
${!isForClientSide ? '' : getGlobs('pageClientFiles', globRoots, 'page.client', true, true)}
${getGlobs('pageServerFiles', globRoots, 'page.server', isForClientSide)}
${getGlobs('pageRouteFiles', globRoots, 'page.route', false)}
`
  return fileContent
}

function getGlobs(
  varName: 'pageIsomorphicFiles' | 'pageClientFiles' | 'pageServerFiles' | 'pageRouteFiles',
  globRoots: string[],
  fileSuffix: 'page' | 'page.client' | 'page.server' | 'page.route',
  isMeta: boolean,
  appendMetaModifier?: true,
): string {
  // Waiting on Vite to implement custom modifier support
  {
    if (appendMetaModifier) {
      return ''
    }
    isMeta = false
  }

  const varNameLocals: string[] = []
  return [
    ...globRoots.map((globRoot, i) => {
      const varNameLocal = `${varName}${i + 1}`
      varNameLocals.push(varNameLocal)
      const metaModifier = !appendMetaModifier ? '' : ", { as: 'meta' }"
      return `const ${varNameLocal} = import.meta.glob('${getGlobPath(globRoot, fileSuffix)}'${metaModifier});`
    }),
    `const ${varName} = {${varNameLocals.map((varNameLocal) => `...${varNameLocal}`).join(',')}};`,
    `pageFiles${isMeta ? 'Meta' : ''}['.${fileSuffix}'] = ${varName}`,
  ].join('\n')
}
