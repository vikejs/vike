export default plugin
export { plugin }
// TODO/v1-release: remove
export { plugin as ssr }
export type { ConfigVikeUserProvided as UserConfig }
export { PROJECT_VERSION as version } from './utils.js'

import type { Plugin } from 'vite'
import { assertUsage, markEnvAsVite } from './utils.js'
import { buildConfig } from './plugins/buildConfig.js'
import { previewConfig } from './plugins/previewConfig.js'
import { autoFullBuild } from './plugins/autoFullBuild.js'
import { devConfig } from './plugins/devConfig/index.js'
import { packageJsonFile } from './plugins/packageJsonFile.js'
import { removeRequireHookPlugin } from './plugins/removeRequireHookPlugin.js'
import { importUserCode } from './plugins/importUserCode/index.js'
import { resolveVikeConfig } from './plugins/config/index.js'
import type { ConfigVikeUserProvided } from '../../shared/ConfigVike.js'
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
import pc from '@brillout/picocolors'

markEnvAsVite()

// Return as `any` to avoid Plugin type mismatches when there are multiple Vite versions installed
function plugin(vikeConfig?: ConfigVikeUserProvided): any {
  const plugins: Plugin[] = [
    resolveVikeConfig(vikeConfig), // The configResolved() hook of resolveVikeConfig() should be the first called
    ...commonConfig(),
    importUserCode(),
    ...devConfig(),
    buildConfig(),
    previewConfig(),
    ...autoFullBuild(),
    packageJsonFile(),
    removeRequireHookPlugin(),
    distFileNames(),
    ...extractAssetsPlugin(),
    extractExportNamesPlugin(),
    suppressRollupWarning(),
    setGlobalContext(),
    ...importBuild(),
    extensionsAssets(),
    baseUrls(vikeConfig),
    envVarsPlugin()
  ]
  return plugins
}

// Enable `const vike = require('vike/plugin')`.
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
      `Add ${pc.cyan('vike()')} instead of ${pc.cyan(
        'vike'
      )} to vite.config.js#plugins (i.e. call the function and add the return value instead of adding the function itself)`,
      { showStackTrace: true }
    )
  }
})
