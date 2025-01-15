export default plugin
export { plugin }
// TODO/v1-release: remove
export { plugin as ssr }
export type { ConfigVikeUserProvided as UserConfig }
export { PROJECT_VERSION as version } from './utils.js'

import { version, type Plugin } from 'vite'
import { assertNodeEnv_onVikeVitePlugin, assertUsage, assertVersion, markSetup_vikeVitePlugin } from './utils.js'
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
import { baseUrls } from './plugins/baseUrls.js'
import { envVarsPlugin } from './plugins/envVars.js'
import pc from '@brillout/picocolors'
import { fileEnv } from './plugins/fileEnv.js'
import { setResolveClientEntriesDev } from '../runtime/renderPage/getPageAssets.js'
import { resolveClientEntriesDev } from './resolveClientEntriesDev.js'
import { workaroundCssModuleHmr } from './plugins/workaroundCssModuleHmr.js'
import { vite6HmrRegressionWorkaround } from './plugins/vite6HmrRegressionWorkaround.js'

assertNodeEnv_onVikeVitePlugin()
markSetup_vikeVitePlugin()
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
    ...setGlobalContext(),
    ...importBuild(),
    baseUrls(vikeConfig),
    envVarsPlugin(),
    fileEnv(),
    workaroundCssModuleHmr(),
    vite6HmrRegressionWorkaround()
  ]
  return plugins
}

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

// Ensures following works: `const vike = require('vike/plugin')` / `import vike from 'vike/plugin'`
//  - It needs to live at the end of this file, in order to ensure we do it after all assignments to `exports`.
try {
  module.exports = Object.assign(exports.default, exports)
} catch {}
