export default plugin
export { plugin }
// TO-DO/next-major-release: remove
export { plugin as ssr }
export { getVikeConfig } from './shared/resolveVikeConfigInternal.js'
export { PROJECT_VERSION as version } from './utils.js'
export type { VikeVitePluginOptions as UserConfig }
export type { VikeVitePluginOptions }

import type { Plugin } from 'vite'
import { getClientEntrySrcDev } from './shared/getClientEntrySrcDev.js'
import { setGetClientEntrySrcDev } from '../runtime/renderPage/getPageAssets/retrievePageAssetsDev.js'
import { assertUsage } from './utils.js'
import pc from '@brillout/picocolors'
import { pluginPreview } from './plugins/pluginPreview.js'
import { pluginDev } from './plugins/pluginDev.js'
import { pluginVirtualFiles } from './plugins/pluginVirtualFiles.js'
import { pluginExtractAssets } from './plugins/pluginExtractAssets.js'
import { pluginExtractExportNames } from './plugins/pluginExtractExportNames.js'
import { pluginSetGlobalContext } from './plugins/pluginSetGlobalContext.js'
import { pluginCommon } from './plugins/pluginCommon.js'
import { pluginBaseUrls } from './plugins/pluginBaseUrls.js'
import { pluginEnvVars } from './plugins/pluginEnvVars.js'
import { pluginFileEnv } from './plugins/pluginFileEnv.js'
import { pluginWorkaroundCssModuleHmr } from './plugins/pluginWorkaroundCssModuleHmr.js'
import { pluginWorkaroundVite6HmrRegression } from './plugins/pluginWorkaroundVite6HmrRegression.js'
import { pluginReplaceIsClientSide } from './plugins/pluginReplaceIsClientSide.js'
import { pluginReplaceGlobalThisConstants } from './plugins/pluginReplaceGlobalThisConstants.js'
import { pluginNonRunnableDev } from './plugins/pluginNonRunnableDev.js'
import { pluginBuildApp } from './plugins/pluginBuild/pluginBuildApp.js'
import { pluginDistPackageJsonFile } from './plugins/pluginBuild/pluginDistPackageJsonFile.js'
import { pluginSuppressRollupWarning } from './plugins/pluginBuild/pluginSuppressRollupWarning.js'
import { pluginDistFileNames } from './plugins/pluginBuild/pluginDistFileNames.js'
import { pluginProdBuildEntry } from './plugins/pluginBuild/pluginProdBuildEntry.js'
import { pluginBuildConfig } from './plugins/pluginBuild/pluginBuildConfig.js'
import { pluginModuleBanner } from './plugins/pluginBuild/pluginModuleBanner.js'

// We don't call this in ./onLoad.ts to avoid a cyclic dependency with utils.ts
setGetClientEntrySrcDev(getClientEntrySrcDev)

type PluginInterop = Record<string, unknown> & { name: string }
// Return `PluginInterop` instead of `Plugin` to avoid type mismatch upon different Vite versions
function plugin(vikeVitePluginOptions: VikeVitePluginOptions = {}): PluginInterop[] {
  // TODO/now: make all plugins return Plugin[] instead of Plugin
  const plugins: Plugin[] = [
    ...pluginCommon(vikeVitePluginOptions),
    pluginVirtualFiles(),
    ...pluginDev(),
    ...pluginBuild(),
    pluginPreview(),
    ...pluginExtractAssets(),
    pluginExtractExportNames(),
    ...pluginSetGlobalContext(),
    pluginBaseUrls(),
    pluginEnvVars(),
    pluginFileEnv(),
    pluginWorkaroundCssModuleHmr(),
    pluginWorkaroundVite6HmrRegression(),
    pluginReplaceIsClientSide(),
    pluginReplaceGlobalThisConstants(),
    pluginNonRunnableDev(),
  ]
  Object.assign(plugins, { _vikeVitePluginOptions: vikeVitePluginOptions })
  return plugins as any
}

function pluginBuild(): Plugin[] {
  return [
    ...pluginBuildConfig(),
    ...pluginBuildApp(),
    ...pluginProdBuildEntry(),
    pluginDistPackageJsonFile(),
    pluginSuppressRollupWarning(),
    pluginDistFileNames(),
    pluginModuleBanner(),
  ]
}

// Error upon wrong usage
Object.defineProperty(plugin, 'apply', {
  enumerable: true,
  get: () => {
    assertUsage(
      false,
      `Add ${pc.cyan('vike()')} instead of ${pc.cyan(
        'vike',
      )} to vite.config.js#plugins (i.e. call the function and add the return value instead of adding the function itself)`,
      { showStackTrace: true },
    )
  },
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

// CJS default export `const vike = require('vike/plugin')`
//  - It needs to live at the end of this file, in order to ensure we do it after all assignments to `exports`.
try {
  module.exports = Object.assign(exports.default, exports)
} catch {}
