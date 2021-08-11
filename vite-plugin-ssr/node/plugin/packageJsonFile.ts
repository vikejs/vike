/*
 * We create a file `dist/server/package.json` to support ESM users.
 * Otherwise, following error is thrown:
 *   Must use import to load ES Module: dist/server/pageFiles.js
 *   require() of ES modules is not supported.
 *   require() of dist/server/pageFiles.js from node_modules/vite-plugin-ssr/dist/cjs/node/page-files/setup.js is an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which defines all .js files in that package scope as ES modules.
 * Reproduction: https://github.com/brillout/vite-plugin-ssr-server-import-syntax
 */

import type { Plugin } from 'vite'
import { isSSR } from './utils'

export { packageJsonFile }

function packageJsonFile(): Plugin {
  let ssr: boolean
  return {
    name: 'vite-plugin-ssr:packageJsonFile',
    apply: 'build',
    configResolved(config) {
      ssr = isSSR(config)
    },
    generateBundle() {
      if (!ssr) return
      this.emitFile({
        fileName: `package.json`,
        type: 'asset',
        source: getPackageJsonContent()
      })
    }
  } as Plugin
}

function getPackageJsonContent(): string {
  return '{ "type": "commonjs" }'
}
