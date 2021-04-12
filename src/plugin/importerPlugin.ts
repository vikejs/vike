import { Plugin } from 'vite'

export { importerPlugin }

function importerPlugin(): Plugin {
  let ssr: boolean
  return {
    name: 'vite-plugin-ssr:importer',
    apply: 'build',
    configResolved(config) {
      ssr = isSSR(config)
    },
    generateBundle() {
      if (!ssr) return
      this.emitFile({
        fileName: `importer.js`,
        type: 'asset',
        source: getImporterCode()
      })
    }
  } as Plugin
}

function getImporterCode(): string {
  return `// Import/require this file if you need to bundle your entire server code into a single file. For example for Cloudflare Workers.
// (The path of following dependencies are normally determined at run-time; this file makes them statically-analysable instead so that bundlers can determine the entire dependency tree at build-time.)
const { pageFiles } = require("./pageFiles.node.js");
const clientManifest = require("../client/manifest.json");
const serverManifest = require("../server/manifest.json");
const { __private: { setPageFiles, setViteManifest } } = require("vite-plugin-ssr");
setViteManifest({ clientManifest, serverManifest });
setPageFiles(pageFiles);
`
}

function isSSR(config: { build?: { ssr?: boolean | string } }): boolean {
  return !!config?.build?.ssr
}
