import { Plugin } from 'vite'

export { importer }

function importer(): Plugin {
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
      this.emitFile({
        fileName: `renderPage.js`,
        type: 'asset',
        source: getRenderPageCode()
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


/* Source: https://www.typescriptlang.org/play?module=1#code/JYWwDg9gTgLgBAbzgYygUwIYzQBQwczQCU0A7AEzSjgF84AzKCEOAIgDdhsBaMAGwCu+YKW4BnMVFYBuAFChIsNgDoA9AujYoygFZiZs5BFJj46ClTyE4AXhTosuAsTKUoACiTAxOJuQHIMMDGAFxwMFACaLQAlHJoAB6K8EjmblbRNNJAA
 *  ```ts
 *  import { createPageRender } from "vite-plugin-ssr";
 *  import "./importer.js";
 *  const renderPage = createPageRender({ isProduction: true });
 *  export { renderPage };
 *  ```
 */
function getRenderPageCode(): string {
  return `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderPage = void 0;
const vite_plugin_ssr_1 = require("vite-plugin-ssr");
require("./importer.js");
const renderPage = vite_plugin_ssr_1.createPageRender({ isProduction: true });
exports.renderPage = renderPage;
`
}

/*
`
import "./importer.js";
declare const renderPage: typeof import("vite-plugin-ssr/dist/cjs/renderPage.node").renderPage;
export { renderPage };`
*/

function isSSR(config: { build?: { ssr?: boolean | string } }): boolean {
  return !!config?.build?.ssr
}
