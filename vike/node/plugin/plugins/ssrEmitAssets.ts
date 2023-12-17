export { ssrEmitAssetsPlugin, injectCssAfterPrerender }

import type { Plugin } from 'vite'
import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'
import { ViteManifestEntry } from '../../shared/ViteManifest.js'
import fg from 'fast-glob'
import { getGlobalObject } from '../utils.js'

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
      const clientManifestPath = path.posix.join(globalObject.outDirClientAbs, "..", "assets.json")
      const assetsDirServerAbs = path.posix.join(globalObject.outDirServerAbs, 'assets')
      const assetsDirClientAbs = path.posix.join(globalObject.outDirClientAbs, 'assets')
      if (!existsSync(assetsDirServerAbs)) {
        return
      }
      await fs.cp(assetsDirServerAbs, assetsDirClientAbs, { recursive: true, force: true })
      await fs.rm(assetsDirServerAbs, { recursive: true })
    }
  }
}

async function injectCssAfterPrerender() {
  const serverManifestPath = path.posix.join(globalObject.outDirServerAbs, 'manifest.json')
  const serverManifest = JSON.parse(await fs.readFile(serverManifestPath, 'utf-8'))
  const serverManifestParsed = Object.entries<ViteManifestEntry>(serverManifest)
  const findCss = (entry: ViteManifestEntry) => {
    const css = []
    const chunks = new Set([entry.src])
    for (let chunkPath of chunks) {
      const chunk = serverManifestParsed.find(([key]) => key === chunkPath)![1]
      for (const import_ of chunk.imports ?? []) {
        chunks.add(import_)
      }
      for (const css_ of chunk.css ?? []) {
        css.push({ src: css_, hash: css_.split('.').at(-2)! })
      }
    }
    return css
  }
  const entries = serverManifestParsed.filter(([, v]) => v.isEntry).map(([, v]) => v)
  for (const entry of entries) {
    const pageId = entry.src!.split(':').pop()!.replace('/pages', '')
    const css = findCss(entry)
    if (!css.length) {
      continue
    }
    const hasParameter = pageId.endsWith('@id')
    const globs = [`${pageId.substring(1).replace('/@id', '')}${hasParameter ? '/*' : ''}/index.html`]

    if (pageId === '/index') {
      globs.push('index.html')
    }

    const htmlFiles = await fg(globs, {
      cwd: globalObject.outDirClientAbs
    })

    // console.log({
    //     globs,
    //     css,
    //     hasParameter,
    //     htmlFiles,
    //     pageId,
    //     entry
    // });

    for (const htmlFile of htmlFiles) {
      const htmlFileAbs = path.posix.join(globalObject.outDirClientAbs, htmlFile)
      const file = await fs.readFile(htmlFileAbs, 'utf-8')
      const notImportedCss = css.filter((css) => !file.includes(css.hash))
      const scriptTags = notImportedCss
        .map((css) => `<link rel="stylesheet" type="text/css" href="/${css.src}">`)
        .join('\n')
      const newFile = file.replace('</head>', `${scriptTags}</head>`)
      await fs.writeFile(htmlFileAbs, newFile, 'utf-8')
    }
  }
}
