export { virtualPageFilesMeta }

import type { Plugin, ViteDevServer } from 'vite'
import glob from 'fast-glob'
import path from 'path'
import { toPosixPath, assert } from './utils'
import { getGlobPath } from './glob'

function virtualPageFilesMeta(getGlobRoots: (root: string) => Promise<string[]>) {
  let root: string
  let viteDevServer: ViteDevServer | null = null
  return {
    name: 'vite-plugin-ssr:virtual',
    async load(id) {
      assert(root)
      const fileType = getIdMatch(id)
      if (fileType) {
        const globRoots = await getGlobRoots(root)
        const src = await getSrc(fileType, root, viteDevServer, id, globRoots)
        return src
      }
    },
    configResolved(config) {
      root = config.root
      assert(root)
    },
    resolveId(id) {
      if (getIdMatch(id)) {
        return id
      }
    },
    configureServer(viteDevServer_) {
      viteDevServer = viteDevServer_
    },
  } as Plugin
}

function getIdMatch(id: string) {
  const importNamePrefix = 'virtual:vite-plugin-ssr:pageFilesMeta:'
  if (!id.startsWith(importNamePrefix)) {
    return null
  }
  const fileType = id.slice(importNamePrefix.length)
  assert(fileType === '.page.js' || fileType === '.page.client.js', { id, fileType })
  return fileType
}

async function getSrc(
  fileType: '.page.js' | '.page.client.js',
  root: string,
  viteDevServer: ViteDevServer | null,
  id: string,
  globRoots: string[],
) {
  const patterns: string[] = []

  const files: string[] = []
  await Promise.all(
    globRoots.map(async (globRoot) => {
      const fileSuffix = (fileType === '.page.js' && 'page') || (fileType === '.page.client.js' && 'page.client')
      assert(fileSuffix)
      const pattern = getGlobPath(globRoot, fileSuffix)
      assert(pattern.startsWith('/'), { pattern })
      patterns.push(pattern)
      const ignore = /(^|\/)node_modules\//.test(pattern) ? [] : ['**/node_modules/**']
      /*
      const patternAbsolute = root + pattern
      const filesFound = await glob(patternAbsolute, {
        ignore,
      })
      /*/
      const patternAbsolute = pattern.slice(1)
      let filesFound = await glob(patternAbsolute, {
        cwd: root,
        ignore,
      })
      filesFound = filesFound.map((f) => root +'/'+ f)
      //*/
      // console.log('f', { pattern, patternAbsolute, ignore, root, filesFound })
      files.push(...filesFound)
    }),
  )

  const importCode: string[] = []
  const assignCode: string[] = []
  files.forEach((filePath, i) => {
    filePath = toPosixPath(filePath)
    assert(filePath.startsWith(root), { root, filePath })
    const pathFromRoot = path.posix.relative(root, filePath)
    assert(!pathFromRoot.startsWith('/'))
    const varName = `pageFileMeta${i}`
    importCode.push(`import * as ${varName} from '${filePath}?meta';`)
    assignCode.push(`  ['/${pathFromRoot}']: ${varName},`)
  })

  const src = `// Virtual File

${importCode.join('\n')}

const pageFilesMeta = {
${assignCode.join('\n')}
};

export default pageFilesMeta;
`

  //*
  viteDevServer
  id
  /*/
  // Mimick HMR support of `import.meta.globEager()`
  if (viteDevServer) {
    const { moduleGraph } = viteDevServer
    const importerModule: any =
      moduleGraph.getModuleById(id) || moduleGraph.getModulesByFile(id) || moduleGraph.getModuleByUrl(id)
    assert(importerModule, { id, notFoundInModuleGraph: true })
    const server = viteDevServer as any
    assert(importerModule.file, { id, fileMissing: true })
    if (!(importerModule.file in server._globImporters)) {
      server._globImporters[importerModule.file!] = {
        module: importerModule,
        importGlobs: [],
      }
    }
    patterns.forEach((pattern) => {
      server._globImporters[importerModule.file!].importGlobs.push({
        base: root,
        pattern,
      })
    })
  }
  //*/

  // console.log(src)
  return src
}
