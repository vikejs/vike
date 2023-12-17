export { ssrEmitAssetsPlugin, injectCssAfterPrerender }

import type { Plugin } from 'vite'
import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'
import { ViteManifestEntry } from '../../shared/ViteManifest.js'
import fg from 'fast-glob'
import { assert, getGlobalObject } from '../utils.js'

const globalObject = getGlobalObject('ssrEmitAssets.ts', {
  outDirServerAbs: '',
  outDirClientAbs: ''
})

function ssrEmitAssetsPlugin(): Plugin {
  return {
    name: 'vike:ssrEmitAssets',
    enforce: 'post',
    apply(config, env) {
      //@ts-expect-error Vite 5 || Vite 4
      return !!(env.isSsrBuild || env.ssrBuild)
    },
    config(config, env) {
      return {
        build: {
          ssrEmitAssets: true,
          manifest: true,
          cssMinify: 'esbuild'
        }
      }
    },
    configResolved(config) {
      globalObject.outDirServerAbs = path.posix.join(config.root, config.build.outDir)
      globalObject.outDirClientAbs = path.posix.resolve(globalObject.outDirServerAbs, '..', 'client')
    },
    async closeBundle() {
      const assetsDirServerAbs = path.posix.join(globalObject.outDirServerAbs, 'assets')
      const assetsDirClientAbs = path.posix.join(globalObject.outDirClientAbs, 'assets')
      if (!existsSync(assetsDirServerAbs)) {
        return
      }
      //TODO: This can create duplicates
      await fs.cp(assetsDirServerAbs, assetsDirClientAbs, { recursive: true, force: true })
      await fs.rm(assetsDirServerAbs, { recursive: true })
    }
  }
}

async function injectCssAfterPrerender() {
  const clientManifestPath = path.posix.join(globalObject.outDirClientAbs, '..', 'assets.json')
  const clientManifestParsed = Object.entries<ViteManifestEntry>(
    JSON.parse(await fs.readFile(clientManifestPath, 'utf-8'))
  )
  const serverManifestPath = path.posix.join(globalObject.outDirServerAbs, 'manifest.json')
  const serverManifestParsed = Object.entries<ViteManifestEntry>(
    JSON.parse(await fs.readFile(serverManifestPath, 'utf-8'))
  )

  // Use the css src from client manifest, if the same css file is included in both
  const joinedManifest = [...clientManifestParsed, ...serverManifestParsed]

  for (const [, entry] of serverManifestParsed.filter(([, { isEntry }]) => isEntry)) {
    const pageId = entry.src!.split(':').pop()!.replace('/pages', '')
    const css = collectCssForEntry(joinedManifest, entry)
    if (!css.length) {
      continue
    }

    const globs = [`${pageId.substring(1).replace('@id', '*')}/index.html`]

    if (pageId === '/index') {
      globs.push('index.html')
    }

    const htmlFiles = await fg(globs, {
      cwd: globalObject.outDirClientAbs
    })

    for (const htmlFile of htmlFiles) {
      const htmlFileAbs = path.posix.join(globalObject.outDirClientAbs, htmlFile)
      const file = await fs.readFile(htmlFileAbs, 'utf-8')
      const notImportedCss = css.filter((css) => !file.includes(`href="/${css.src}"`))
      const scriptTags = notImportedCss
        .map((css) => `<link rel="stylesheet" type="text/css" href="/${css.src}">`)
        .join('\n')
      const newFile = file.replace('</head>', `${scriptTags}</head>`)
      await fs.writeFile(htmlFileAbs, newFile, 'utf-8')
    }
  }
}

function collectCssForEntry(manifestEntries: [string, ViteManifestEntry][], entry: ViteManifestEntry) {
  const css = []
  const chunks = new Set([entry.src])
  for (const chunkSrc of chunks) {
    const chunk = manifestEntries.find(([key]) => key === chunkSrc)?.[1]
    assert(chunk)
    for (const import_ of chunk.imports ?? []) {
      chunks.add(import_)
    }
    for (let css_ of chunk.css ?? []) {
      const hash = css_.split('.').at(-2)
      assert(hash)
      const cssEntry = manifestEntries.find(([, manifestEntry]) => manifestEntry.file.includes(hash))
      assert(cssEntry)

      css.push({ src: cssEntry[1].file, hash })
    }
  }
  return css
}
