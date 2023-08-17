export default plugin
export { plugin }
export { plugin as ssr }
export type { ConfigVpsUserProvided as UserConfig }

import type { Plugin } from 'vite'
import { assertUsage, markEnvAsVite } from './utils.js'
import { buildConfig } from './plugins/buildConfig.js'
import { previewConfig } from './plugins/previewConfig.js'
import { autoFullBuild } from './plugins/autoFullBuild.js'
import { devConfig } from './plugins/devConfig/index.js'
import { manifest } from './plugins/manifest.js'
import { packageJsonFile } from './plugins/packageJsonFile.js'
import { removeRequireHookPlugin } from './plugins/removeRequireHookPlugin.js'
import { importUserCode } from './plugins/importUserCode/index.js'
import { resolveVpsConfig } from './plugins/config/index.js'
import type { ConfigVpsUserProvided } from '../../shared/ConfigVps.js'
import { distFileNames } from './plugins/distFileNames.js'
import { extractAssetsPlugin } from './plugins/extractAssetsPlugin.js'
import { extractExportNamesPlugin } from './plugins/extractExportNamesPlugin.js'
import { suppressRollupWarning } from './plugins/suppressRollupWarning.js'
import { setGlobalContext } from './plugins/setGlobalContext.js'
import { importBuild } from './plugins/importBuild/index.js'
import { commonConfig } from './plugins/commonConfig.js'
import { extensionsAssets } from './plugins/extensionsAssets.js'
import { baseUrls } from './plugins/baseUrls.js'
import { envVarsPlugin } from './plugins/envVars.js'

markEnvAsVite()

// Return as `any` to avoid Plugin type mismatches when there are multiple Vite versions installed
function plugin(vpsConfig?: ConfigVpsUserProvided): any {
  const plugins: Plugin[] = [
    resolveVpsConfig(vpsConfig), // `resolveVpsConfig()`'s hook `configResolved()` should be the first called
    ...commonConfig(),
    importUserCode(),
    ...devConfig(),
    buildConfig(),
    previewConfig(),
    ...autoFullBuild(),
    ...manifest(),
    packageJsonFile(),
    removeRequireHookPlugin(),
    distFileNames(),
    ...extractAssetsPlugin(),
    extractExportNamesPlugin(),
    suppressRollupWarning(),
    setGlobalContext(),
    ...importBuild(),
    extensionsAssets(),
    baseUrls(vpsConfig),
    envVarsPlugin()
  ]
  return plugins
}

// Enable `const ssr = require('vite-plugin-ssr/plugin')`.
//  - This lives at the end of the file to ensure it happens after all assignments to `exports`.
//  - This is only used for the CJS build; we wrap it in a try-catch for the ESM build.
try {
  module.exports = Object.assign(exports.default, exports)
} catch {}

// Error upon wrong usage
Object.defineProperty(plugin, 'apply', {
  enumerable: true,
  get: () => {
    assertUsage(
      false,
      'Add `ssr()` instead of `ssr` to vite.config.js#plugins (i.e. call the function and add the return value instead of adding the function itself)',
      { showStackTrace: true }
    )
  }
})
