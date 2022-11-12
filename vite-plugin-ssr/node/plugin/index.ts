export default plugin
export { plugin }
export { plugin as ssr }
export type { UserConfig }

import type { Plugin } from 'vite'
import { assertUsage } from './utils'
import { buildConfig } from './plugins/buildConfig'
import { previewConfig } from './plugins/previewConfig'
import { autoFullBuild } from './plugins/autoFullBuild'
import { devConfig } from './plugins/devConfig'
import { manifest } from './plugins/manifest'
import { packageJsonFile } from './plugins/packageJsonFile'
import { removeRequireHookPlugin } from './plugins/removeRequireHookPlugin'
import { generateImportGlobs } from './plugins/generateImportGlobs'
import { resolveVpsConfig } from './plugins/config'
import type { ConfigVpsUserProvided as UserConfig } from './plugins/config/ConfigVps'
import { distFileNames } from './plugins/distFileNames'
import { extractAssetsPlugin } from './plugins/extractAssetsPlugin'
import { extractExportNamesPlugin } from './plugins/extractExportNamesPlugin'
import { suppressRollupWarning } from './plugins/suppressRollupWarning'
import { retrieveDevServer } from './plugins/retrieveDevServer'
import { importBuild } from './plugins/importBuild'
import { commonConfig } from './plugins/commonConfig'

// Return as `any` to avoid Plugin type mismatches when there are multiple Vite versions installed
function plugin(vpsConfig?: UserConfig): any {
  const plugins: Plugin[] = [
    resolveVpsConfig(vpsConfig), // `resolveVpsConfig()`'s hook `configResolved()` should be the first called
    commonConfig(),
    generateImportGlobs(),
    ...devConfig(),
    buildConfig(),
    previewConfig(),
    autoFullBuild(),
    ...manifest(),
    packageJsonFile(),
    removeRequireHookPlugin(),
    distFileNames(),
    ...extractAssetsPlugin(),
    extractExportNamesPlugin(),
    suppressRollupWarning(),
    retrieveDevServer(),
    ...importBuild()
  ]
  return plugins
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
      'Make sure to instantiate the `ssr` plugin (`import ssr from "vite-plugin-ssr"`): include `ssr()` instead of `ssr` in the `plugins` list of your `vite.config.js`.'
    )
  }
})
