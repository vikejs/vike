#!/usr/bin/env zx

import assert from 'assert'

const files = [
'./vite-plugin-ssr/node/ssrEnv.node.ts',
'./vite-plugin-ssr/node/html/index.node.ts',
'./vite-plugin-ssr/node/html/injectAssets.node.ts',
'./vite-plugin-ssr/node/cli/bin.node.ts',
'./vite-plugin-ssr/node/page-files/pageFiles.node.ts',
'./vite-plugin-ssr/node/page-files/loadViteEntry.node.ts',
'./vite-plugin-ssr/node/page-files/setup.node.ts',
'./vite-plugin-ssr/node/createPageRender.node.ts',
'./vite-plugin-ssr/node/getPreloadTags.node.ts',
'./vite-plugin-ssr/node/getViteManifest.node.ts',
'./vite-plugin-ssr/node/renderPage.node.ts',
]

await Promise.all(files.map(async file => {
  const fileNew = file.replace('.node.ts', '.ts')
  assert(file!==fileNew)
  await $`mv ${file} ${fileNew}`
}))
