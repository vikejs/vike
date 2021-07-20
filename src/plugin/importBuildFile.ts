import type { Plugin } from 'vite'
import { isSSR } from './utils'

export { importBuildFile }

function importBuildFile(): Plugin {
  let ssr: boolean
  return {
    name: 'vite-plugin-ssr:importBuildFile',
    apply: 'build',
    configResolved(config) {
      ssr = isSSR(config)
    },
    generateBundle() {
      if (!ssr) return
      this.emitFile({
        fileName: `importBuild.js`,
        type: 'asset',
        source: getImportBuildCode()
      })
    }
  } as Plugin
}

function getImportBuildCode(): string {
  return `// We need to load this file if our server code is bundled. For example we need to load this file for:
//  - Cloudflare Workers as it needs the entire worker code (i.e. our server code) to be bundled into a single file.
//  - Vercel as it bundles our serverless functions (i.e. our server code) behind the scenes.

// The path of following dependencies are normally determined dynamically at run-time; this file makes these dependencies discoverable at build-time so that bundlers are able to determine the entire dependency tree.
const { pageFiles } = require("./pageFiles.node.js");
const clientManifest = require("../client/manifest.json");
const serverManifest = require("../server/manifest.json");
const { __private: { importBuild } } = require("vite-plugin-ssr");
importBuild({ pageFiles, clientManifest, serverManifest });
`
}
