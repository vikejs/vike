export default plugin
export { plugin }
export { plugin as ssr }

import type { Plugin } from 'vite'
import { assertUsage } from './utils'
import { build } from './plugins/build'
import { dev } from './plugins/dev'
import { manifest } from './plugins/manifest'
import { packageJsonFile } from './plugins/packageJsonFile'
import { removeRequireHookPlugin } from './plugins/removeRequireHookPlugin'
import { generateImportGlobs } from './plugins/generateImportGlobs'
import { resolveConfig, Config } from './resolveConfig'
import { distFileNames } from './plugins/distFileNames'
import { virtualPageFilesExportNames } from './plugins/virtualPageFilesExportNames'
import { extractStylesPlugin } from './plugins/extractStylesPlugin'
import { extractExportNamesPlugin } from './plugins/extractExportNamesPlugin'
import { suppressRollupWarning } from './plugins/suppressRollupWarning'
import { retrieveDevServer } from './plugins/retrieveDevServer'
import { distLink } from './plugins/distLink'

// Return as `any` to avoid Plugin type mismatches when there are multiple Vite versions installed
function plugin(config?: Config): any {
  const { getGlobRoots } = resolveConfig(config)
  const plugins: Plugin[] = [
    generateImportGlobs(getGlobRoots),
    dev(),
    build(),
    ...manifest(),
    packageJsonFile(),
    removeRequireHookPlugin(),
    distFileNames(),
    virtualPageFilesExportNames(getGlobRoots),
    ...extractStylesPlugin(),
    extractExportNamesPlugin(),
    suppressRollupWarning(),
    retrieveDevServer(),
    ...distLink(),
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
