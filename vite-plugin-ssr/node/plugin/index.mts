export default plugin
export { plugin }
export { plugin as ssr }
export type { ConfigVpsUserProvided as UserConfig }

import type { Plugin } from 'vite'
import { assertUsage, markEnvAsVite } from './utils.mjs'
import { buildConfig } from './plugins/buildConfig.mjs'
import { previewConfig } from './plugins/previewConfig.mjs'
import { autoFullBuild } from './plugins/autoFullBuild.mjs'
import { devConfig } from './plugins/devConfig/index.mjs'
import { manifest } from './plugins/manifest.mjs'
import { packageJsonFile } from './plugins/packageJsonFile.mjs'
import { removeRequireHookPlugin } from './plugins/removeRequireHookPlugin.mjs'
import { importUserCode } from './plugins/importUserCode/index.mjs'
import { resolveVpsConfig } from './plugins/config/index.mjs'
import type { ConfigVpsUserProvided } from '../../shared/ConfigVps.mjs'
import { distFileNames } from './plugins/distFileNames.mjs'
import { extractAssetsPlugin } from './plugins/extractAssetsPlugin.mjs'
import { extractExportNamesPlugin } from './plugins/extractExportNamesPlugin.mjs'
import { suppressRollupWarning } from './plugins/suppressRollupWarning.mjs'
import { setGlobalContext } from './plugins/setGlobalContext.mjs'
import { importBuild } from './plugins/importBuild/index.mjs'
import { commonConfig } from './plugins/commonConfig.mjs'
import { extensionsAssets } from './plugins/extensionsAssets.mjs'
import { baseUrls } from './plugins/baseUrls.mjs'
import { envVarsPlugin } from './plugins/envVars.mjs'

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
