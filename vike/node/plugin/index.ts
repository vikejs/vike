export default plugin
export { plugin }
// TODO/v1-release: remove
export { plugin as ssr }
export type { VikeVitePluginOptions as UserConfig }
export type { VikeVitePluginOptions }
export { PROJECT_VERSION as version } from './utils.js'

import pc from '@brillout/picocolors'
import type { Plugin } from 'vite'
import { setResolveClientEntriesDev } from '../runtime/renderPage/getPageAssets.js'
import { autoFullBuild } from './plugins/autoFullBuild.js'
import { baseUrls } from './plugins/baseUrls.js'
import { buildApp } from './plugins/buildApp.js'
import { buildConfig } from './plugins/buildConfig.js'
import { buildEntry } from './plugins/buildEntry/index.js'
import { commonConfig } from './plugins/commonConfig.js'
import { devConfig } from './plugins/devConfig/index.js'
import { distFileNames } from './plugins/distFileNames.js'
import { envVarsPlugin } from './plugins/envVars.js'
import { extractAssetsPlugin } from './plugins/extractAssetsPlugin.js'
import { extractExportNamesPlugin } from './plugins/extractExportNamesPlugin.js'
import { fileEnv } from './plugins/fileEnv.js'
import { importUserCode } from './plugins/importUserCode/index.js'
import { packageJsonFile } from './plugins/packageJsonFile.js'
import { previewConfig } from './plugins/previewConfig.js'
import { removeRequireHookPlugin } from './plugins/removeRequireHookPlugin.js'
import { setGlobalContext } from './plugins/setGlobalContext.js'
import { suppressRollupWarning } from './plugins/suppressRollupWarning.js'
import { workaroundCssModuleHmr } from './plugins/workaroundCssModuleHmr.js'
import { workaroundVite6HmrRegression } from './plugins/workaroundVite6HmrRegression.js'
import { resolveClientEntriesDev } from './shared/resolveClientEntriesDev.js'
import { assertUsage } from './utils.js'

// We don't call this in ./onLoad.ts to avoid a cyclic dependency with utils.ts
setResolveClientEntriesDev(resolveClientEntriesDev)

// Return as `any` to avoid Plugin type mismatches when there are multiple Vite versions installed
function plugin(vikeVitePluginOptions: VikeVitePluginOptions = {}): any {
  const plugins: Plugin[] = [
    ...commonConfig(vikeVitePluginOptions),
    importUserCode(),
    ...devConfig(),
    ...buildConfig(),
    buildApp(),
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

/** @deprecated Define Vike settings in +config.js instead of vite.config.js */
type VikeVitePluginOptions = {
  /** @deprecated Define Vike settings in +config.js instead of vite.config.js */
  prerender?:
    | boolean
    | {
        /** @deprecated Define Vike settings in +config.js instead of vite.config.js */
        noExtraDir?: boolean
        /** @deprecated Define Vike settings in +config.js instead of vite.config.js */
        parallel?: boolean | number
        /** @deprecated Define Vike settings in +config.js instead of vite.config.js */
        partial?: boolean
        /** @deprecated Define Vike settings in +config.js instead of vite.config.js */
        disableAutoRun?: boolean
      }

  /** @deprecated See https://vike.dev/disableAutoFullBuild */
  disableAutoFullBuild?: boolean | 'prerender'

  /** @deprecated Define Vike settings in +config.js instead of vite.config.js */
  baseServer?: string
  /** @deprecated Define Vike settings in +config.js instead of vite.config.js */
  baseAssets?: string

  /** @deprecated It's now `true` by default. You can remove this option. */
  includeAssetsImportedByServer?: boolean

  /** @deprecated Define Vike settings in +config.js instead of vite.config.js */
  redirects?: Record<string, string>

  /** @deprecated Define Vike settings in +config.js instead of vite.config.js */
  trailingSlash?: boolean

  /** @deprecated Define Vike settings in +config.js instead of vite.config.js */
  disableUrlNormalization?: boolean
}

// Ensures following works: `const vike = require('vike/plugin')` / `import vike from 'vike/plugin'`
//  - It needs to live at the end of this file, in order to ensure we do it after all assignments to `exports`.
try {
  module.exports = Object.assign(exports.default, exports)
} catch {}
