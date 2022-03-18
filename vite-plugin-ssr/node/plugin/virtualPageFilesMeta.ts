export { virtualPageFilesMeta }

import type { Plugin, ViteDevServer } from 'vite'
import glob from 'fast-glob'
import path from 'path'
import { toPosixPath, assert, assertPosixPath, getFileExtension } from './utils'
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
  assert(fileType === '.page.js' || fileType === '.page.client.js' || fileType === '.page.server.js', { id, fileType })
  return fileType
}

async function getSrc(
  fileType: '.page.js' | '.page.client.js' | '.page.server.js',
  root: string,
  viteDevServer: ViteDevServer | null,
  id: string,
  globRoots: string[],
) {
  const patterns: string[] = []

  const files: string[] = []
  await Promise.all(
    globRoots.map(async (globRoot) => {
      const fileSuffix =
        (fileType === '.page.js' && 'page') ||
        (fileType === '.page.client.js' && 'page.client') ||
        (fileType === '.page.server.js' && 'page.server')
      assert(fileSuffix)
      const globPath = getGlobPath(globRoot, fileSuffix)
      assertPosixPath(globPath)
      assertPosixPath(root)
      let pattern = globPath
      assert(pattern.startsWith('/'), { pattern })
      patterns.push(pattern)
      const nodeModulesDir = '/node_modules/'
      let patternBase = ''
      if (pattern.includes(nodeModulesDir)) {
        const patternParts = pattern.split(nodeModulesDir)
        patternBase = patternParts.slice(0, -1).join(nodeModulesDir) + nodeModulesDir
        pattern = '/' + patternParts[patternParts.length - 1]!
      }
      pattern = pattern.slice(1)
      const cwd = path.posix.join(root, patternBase)
      let filesFound = await glob(pattern, {
        cwd,
        ignore: [`**${nodeModulesDir}**`],
      })
      filesFound = filesFound.map((f) => path.posix.join(cwd, f))
      // console.log('f', { globPath, pattern, cwd, filesFound})
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
    const fileExtension = getFileExtension(filePath)
    assert(fileExtension, { filePath })
    importCode.push(`import * as ${varName} from '${filePath}?meta&lang.${fileExtension}';`)
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

  return src
}
