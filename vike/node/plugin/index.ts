export default plugin
export { plugin }
// TODO/v1-release: remove
export { plugin as ssr }
export type { VikeVitePluginOptions as UserConfig }
export type { VikeVitePluginOptions }
export { PROJECT_VERSION as version } from './utils.js'

import { version, type Plugin } from 'vite'
import { assertUsage, assertVersion, markSetup_vikeVitePlugin } from './utils.js'
import { buildConfig } from './plugins/buildConfig.js'
import { previewConfig } from './plugins/previewConfig.js'
import { autoFullBuild } from './plugins/autoFullBuild.js'
import { devConfig } from './plugins/devConfig/index.js'
import { packageJsonFile } from './plugins/packageJsonFile.js'
import { removeRequireHookPlugin } from './plugins/removeRequireHookPlugin.js'
import { importUserCode } from './plugins/importUserCode/index.js'
import { distFileNames } from './plugins/distFileNames.js'
import { extractAssetsPlugin } from './plugins/extractAssetsPlugin.js'
import { extractExportNamesPlugin } from './plugins/extractExportNamesPlugin.js'
import { suppressRollupWarning } from './plugins/suppressRollupWarning.js'
import { setGlobalContext } from './plugins/setGlobalContext.js'
import { buildEntry } from './plugins/buildEntry/index.js'
import { commonConfig } from './plugins/commonConfig.js'
import { baseUrls } from './plugins/baseUrls.js'
import { envVarsPlugin } from './plugins/envVars.js'
import pc from '@brillout/picocolors'
import { fileEnv } from './plugins/fileEnv.js'
import { setResolveClientEntriesDev } from '../runtime/renderPage/getPageAssets.js'
import { resolveClientEntriesDev } from './resolveClientEntriesDev.js'
import { workaroundCssModuleHmr } from './plugins/workaroundCssModuleHmr.js'
import { workaroundVite6HmrRegression } from './plugins/workaroundVite6HmrRegression.js'

markSetup_vikeVitePlugin()
assertViteVersion()
setResolveClientEntriesDev(resolveClientEntriesDev)

// Return as `any` to avoid Plugin type mismatches when there are multiple Vite versions installed
function plugin(vikeVitePluginOptions: VikeVitePluginOptions = {}): any {
  const plugins: Plugin[] = [
    ...commonConfig(vikeVitePluginOptions),
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
    ...buildEntry(),
    baseUrls(),
    envVarsPlugin(),
    fileEnv(),
    workaroundCssModuleHmr(),
    workaroundVite6HmrRegression()
  ]
  Object.assign(plugins, { __vikeVitePluginOptions: vikeVitePluginOptions })
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

type VikeVitePluginOptions = {
  /** @deprecated Define this setting in +config.js instead of vite.config.js */
  prerender?:
    | boolean
    | {
        /** @deprecated Define this setting in +config.js instead of vite.config.js */
        noExtraDir?: boolean
        /** @deprecated Define this setting in +config.js instead of vite.config.js */
        parallel?: boolean | number
        /** @deprecated Define this setting in +config.js instead of vite.config.js */
        partial?: boolean
        /** @deprecated Define this setting in +config.js instead of vite.config.js */
        disableAutoRun?: boolean
      }

  /** @deprecated See https://vike.dev/disableAutoFullBuild */
  disableAutoFullBuild?: boolean | 'prerender'

  /** @deprecated Define this setting in +config.js instead of vite.config.js */
  baseServer?: string
  /** @deprecated Define this setting in +config.js instead of vite.config.js */
  baseAssets?: string

  /** @deprecated It's now `true` by default. You can remove this option. */
  includeAssetsImportedByServer?: boolean

  /** @deprecated Define this setting in +config.js instead of vite.config.js */
  redirects?: Record<string, string>

  /** @deprecated Define this setting in +config.js instead of vite.config.js */
  trailingSlash?: boolean

  /** @deprecated Define this setting in +config.js instead of vite.config.js */
  disableUrlNormalization?: boolean
}

// Ensures following works: `const vike = require('vike/plugin')` / `import vike from 'vike/plugin'`
//  - It needs to live at the end of this file, in order to ensure we do it after all assignments to `exports`.
try {
  module.exports = Object.assign(exports.default, exports)
} catch {}
