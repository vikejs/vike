import esbuild from 'esbuild'
import fs from 'fs/promises'
import path from 'path'
import { searchForWorkspaceRoot, type Plugin, type ResolvedConfig } from 'vite'
import type { ConfigVikeNodeResolved } from '../../types.js'
import { assert, assertUsage } from '../../utils/assert.js'
import { toPosixPath } from '../utils/filesystemPathHandling.js'
import { getConfigVikeNode } from '../utils/getConfigVikeNode.js'
import { pLimit } from '../utils/pLimit.js'

const OPTIONAL_NPM_IMPORTS = [
  '@nestjs/microservices',
  '@nestjs/websockets',
  'cache-manager',
  'class-validator',
  'class-transformer'
]

export function standalonePlugin(): Plugin {
  let configResolved: ResolvedConfig
  let configResolvedVike: ConfigVikeNodeResolved
  let enabled = false
  let root = ''
  let outDir = ''
  let outDirAbs = ''
  let rollupEntryFilePaths: string[]
  let rollupResolve: any

  return {
    name: 'vike-node:standalone',
    apply: (_, env) => !!env.isSsrBuild,
    configResolved: async (config) => {
      configResolved = config
      configResolvedVike = getConfigVikeNode(config)
      assert(typeof configResolvedVike.server.standalone === 'boolean')
      enabled = configResolvedVike.server.standalone
      if (!enabled) return
      root = toPosixPath(config.root)
      outDir = toPosixPath(config.build.outDir)
      outDirAbs = path.posix.join(root, outDir)
    },
    buildStart() {
      if (!enabled) return
      rollupResolve = this.resolve.bind(this)
    },
    writeBundle(_, bundle) {
      if (!enabled) return
      const entries = findRollupBundleEntries(bundle, configResolvedVike, root)
      rollupEntryFilePaths = entries.map((e) => path.posix.join(outDirAbs, e.fileName))
    },
    enforce: 'post',
    closeBundle: async () => {
      if (!enabled) return
      const base = toPosixPath(searchForWorkspaceRoot(root))
      const relativeRoot = path.posix.relative(base, root)
      const relativeOutDir = path.posix.join(relativeRoot, outDir)

      const esbuildResult = await buildWithEsbuild()
      await removeLeftoverFiles(esbuildResult)
      await traceAndCopyDependencies(base, relativeRoot, relativeOutDir)
    }
  }

  async function buildWithEsbuild() {
    const res = await esbuild.build({
      platform: 'node',
      format: 'esm',
      bundle: true,
      external: configResolvedVike.server.external,
      entryPoints: rollupEntryFilePaths,
      sourcemap: configResolved.build.sourcemap === 'hidden' ? true : configResolved.build.sourcemap,
      outExtension: { '.js': '.mjs' },
      splitting: rollupEntryFilePaths.length > 1,
      outdir: outDirAbs,
      allowOverwrite: true,
      metafile: true,
      logOverride: { 'ignored-bare-import': 'silent' },
      banner: { js: generateBanner() },
      plugins: [createStandaloneIgnorePlugin(rollupResolve)]
    })

    return res
  }

  async function removeLeftoverFiles(res: Awaited<ReturnType<typeof buildWithEsbuild>>) {
    // Remove bundled files from outDir
    const bundledFilesFromOutDir = Object.keys(res.metafile.inputs).filter(
      (relativeFile) =>
        !rollupEntryFilePaths.some((entryFilePath) => entryFilePath.endsWith(relativeFile)) &&
        relativeFile.startsWith(outDir)
    )

    await Promise.all(
      bundledFilesFromOutDir.map(async (relativeFile) => {
        await fs.rm(path.posix.join(root, relativeFile))
        if (![false, 'inline'].includes(configResolved.build.sourcemap)) {
          await fs.rm(path.posix.join(root, `${relativeFile}.map`))
        }
      })
    )

    // Remove empty directories
    const relativeDirs = new Set(bundledFilesFromOutDir.map((file) => path.dirname(file)))
    for (const relativeDir of relativeDirs) {
      const absDir = path.posix.join(root, relativeDir)
      const files = await fs.readdir(absDir)
      if (!files.length) {
        await fs.rm(absDir, { recursive: true })
        if (relativeDir.startsWith(outDir)) {
          relativeDirs.add(path.dirname(relativeDir))
        }
      }
    }
  }

  async function traceAndCopyDependencies(base: string, relativeRoot: string, relativeOutDir: string) {
    const { nodeFileTrace } = await import('@vercel/nft')
    const result = await nodeFileTrace(rollupEntryFilePaths, { base })

    const tracedDeps = new Set(
      [...result.fileList].filter(
        (file) => !result.reasons.get(file)?.type.includes('initial') && !file.startsWith('usr/')
      )
    )

    const filesToCopy = [...tracedDeps].map(toPosixPath).filter((path) => !path.startsWith(relativeOutDir))

    if (!filesToCopy.length) return

    if (result.warnings.size && isYarnPnP()) {
      assertUsage(false, 'Standalone build is not supported when using Yarn PnP and native dependencies.')
    }

    const commonAncestor = findCommonAncestor(filesToCopy)
    const concurrencyLimit = pLimit(10)
    const copiedFiles = new Set<string>()

    await Promise.all(
      filesToCopy.map((relativeFile) =>
        concurrencyLimit(async () => {
          const tracedFilePath = path.posix.join(base, relativeFile)
          const isNodeModules = relativeFile.includes('node_modules')

          relativeFile = relativeFile.replace(relativeRoot, '').replace(commonAncestor, '')
          const relativeFileHoisted = `node_modules${relativeFile.split('node_modules').pop()}`
          const fileOutputPath = path.posix.join(outDirAbs, isNodeModules ? relativeFileHoisted : relativeFile)

          if (!(await fs.stat(tracedFilePath)).isDirectory() && !copiedFiles.has(fileOutputPath)) {
            copiedFiles.add(fileOutputPath)
            await fs.cp(tracedFilePath, fileOutputPath, { recursive: true, dereference: true })
          }
        })
      )
    )
  }
}

function generateBanner() {
  return [
    "import { dirname as dirname987 } from 'path';",
    "import { fileURLToPath as fileURLToPath987 } from 'url';",
    "import { createRequire as createRequire987 } from 'module';",
    'var require = createRequire987(import.meta.url);',
    'var __filename = fileURLToPath987(import.meta.url);',
    'var __dirname = dirname987(__filename);'
  ].join('\n')
}

function createStandaloneIgnorePlugin(rollupResolve: any): esbuild.Plugin {
  return {
    name: 'standalone-ignore',
    setup(build) {
      build.onResolve({ filter: /.*/, namespace: 'ignore' }, (args) => ({
        path: args.path,
        namespace: 'ignore'
      }))
      build.onResolve({ filter: new RegExp(`^(${OPTIONAL_NPM_IMPORTS.join('|')})`) }, async (args) => {
        const resolved = await rollupResolve(args.path)
        if (!resolved) {
          return { path: args.path, namespace: 'ignore' }
        }
      })
      build.onLoad({ filter: /.*/, namespace: 'ignore' }, () => ({ contents: '' }))
    }
  }
}

function findCommonAncestor(paths: string[]): string {
  if (paths.length <= 1) return ''

  const pathComponents = paths.map((path) => path.split('/'))
  let commonAncestor = ''
  let index = 0

  while (pathComponents.every((components) => components[index] === pathComponents[0]![index])) {
    commonAncestor += pathComponents[0]![index] + '/'
    index++
  }

  return commonAncestor ? commonAncestor.slice(0, -1) : ''
}

function isYarnPnP(): boolean {
  try {
    require('pnpapi')
    return true
  } catch {
    return false
  }
}

function findRollupBundleEntries<OutputBundle extends Record<string, { name: string | undefined }>>(
  bundle: OutputBundle,
  resolvedConfig: ConfigVikeNodeResolved,
  root: string
): OutputBundle[string][] {
  const entryPathsFromConfig = Object.values(resolvedConfig.server.entry).map((entryPath) =>
    path.posix.join(root, entryPath)
  )
  const entries: OutputBundle[string][] = []
  for (const key in bundle) {
    const entry = bundle[key]!
    // https://github.com/brillout/vite-plugin-ssr/issues/612
    if (!('facadeModuleId' in entry) || key.endsWith('.map') || key.endsWith('.json')) continue
    assert(entry.facadeModuleId === null || typeof entry.facadeModuleId === 'string')
    if (entry.facadeModuleId && entryPathsFromConfig.includes(entry.facadeModuleId)) {
      entries.push(entry)
    }
  }

  const serverIndex = entries.find((e) => e.name === 'index')
  assert(serverIndex)

  return entries.sort((a, b) => (a.name === 'index' ? -1 : b.name === 'index' ? 1 : 0))
}
