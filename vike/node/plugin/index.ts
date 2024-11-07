export default plugin
export { plugin }
// TODO/v1-release: remove
export { plugin as ssr }
export type { ConfigVikeUserProvided as UserConfig }
export { PROJECT_VERSION as version } from './utils'

import { version, type Plugin } from 'vite'
import { assertNodeEnv_onVikePluginLoad, assertUsage, assertVersion, markEnvAsVikePluginLoaded } from './utils'
import { buildConfig } from './plugins/buildConfig'
import { previewConfig } from './plugins/previewConfig'
import { autoFullBuild } from './plugins/autoFullBuild'
import { devConfig } from './plugins/devConfig/index'
import { packageJsonFile } from './plugins/packageJsonFile'
import { removeRequireHookPlugin } from './plugins/removeRequireHookPlugin'
import { importUserCode } from './plugins/importUserCode/index'
import { resolveVikeConfig } from './plugins/config/index'
import type { ConfigVikeUserProvided } from '../../shared/ConfigVike'
import { distFileNames } from './plugins/distFileNames'
import { extractAssetsPlugin } from './plugins/extractAssetsPlugin'
import { extractExportNamesPlugin } from './plugins/extractExportNamesPlugin'
import { suppressRollupWarning } from './plugins/suppressRollupWarning'
import { setGlobalContext } from './plugins/setGlobalContext'
import { importBuild } from './plugins/importBuild/index'
import { commonConfig } from './plugins/commonConfig'
import { baseUrls } from './plugins/baseUrls'
import { envVarsPlugin } from './plugins/envVars'
import pc from '@brillout/picocolors'
import { fileEnv } from './plugins/fileEnv'
import { setResolveClientEntriesDev } from '../runtime/renderPage/getPageAssets'
import { resolveClientEntriesDev } from './resolveClientEntriesDev'
import { workaroundCssModuleHmr } from './plugins/workaroundCssModuleHmr'

assertNodeEnv_onVikePluginLoad()
markEnvAsVikePluginLoaded()
assertViteVersion()
setResolveClientEntriesDev(resolveClientEntriesDev)

// Return as `any` to avoid Plugin type mismatches when there are multiple Vite versions installed
function plugin(vikeConfig?: ConfigVikeUserProvided): any {
  const plugins: Plugin[] = [
    resolveVikeConfig(vikeConfig), // The configResolved() hook of resolveVikeConfig() should be the first called
    ...commonConfig(),
    importUserCode(),
    ...devConfig(),
    ...buildConfig(),
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
    baseUrls(vikeConfig),
    envVarsPlugin(),
    fileEnv(),
    workaroundCssModuleHmr()
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

// package.json#peerDependencies isn't enough as users can ignore it
function assertViteVersion() {
  assertVersion('Vite', version, '5.1.0')
}
