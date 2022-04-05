export default plugin
export { plugin }
export { plugin as ssr }

import type { Plugin } from 'vite'
import GlobPlugin from 'vite-plugin-glob'
import { assertUsage } from './utils'
import { build } from './plugins/build'
import { dev } from './plugins/dev'
import { manifest } from './plugins/manifest'
import { packageJsonFile } from './plugins/packageJsonFile'
import { removeRequireHookPlugin } from './plugins/removeRequireHookPlugin'
import { generateImportGlobs } from './plugins/generateImportGlobs'
import { setVitePluginSsrConfig } from './plugins/config'
import { distFileNames } from './plugins/distFileNames'
import { extractStylesPlugin } from './plugins/extractStylesPlugin'
import { extractExportNamesPlugin } from './plugins/extractExportNamesPlugin'
import { suppressRollupWarning } from './plugins/suppressRollupWarning'
import { retrieveDevServer } from './plugins/retrieveDevServer'
import { distLink } from './plugins/distLink'
import type { VitePluginSsrConfig } from './plugins/config/VitePluginSsrConfig'

// Return as `any` to avoid Plugin type mismatches when there are multiple Vite versions installed
function plugin(vitePluginSsrConfig?: VitePluginSsrConfig): any {
  const plugins: Plugin[] = [
    setVitePluginSsrConfig(vitePluginSsrConfig),
    generateImportGlobs(),
    dev(),
    build(),
    ...manifest(),
    packageJsonFile(),
    removeRequireHookPlugin(),
    distFileNames(),
    ...extractStylesPlugin(),
    extractExportNamesPlugin(),
    suppressRollupWarning(),
    retrieveDevServer(),
    ...distLink(),
    GlobPlugin() as any,
  ]
  return plugins as any
}

// Enable `const ssr = require('vite-plugin-ssr/plugin')`
// This lives at the end of the file to ensure it happens after all assignments to `exports`
module.exports = Object.assign(exports.default, exports)

// Error upon wrong usage
Object.defineProperty(plugin, 'apply', {
  enumerable: true,
  get: () => {
    assertUsage(
      false,
      'Make sure to instantiate the `ssr` plugin (`import ssr from "vite-plugin-ssr"`): include `ssr()` instead of `ssr` in the `plugins` list of your `vite.config.js`.',
    )
  },
})
