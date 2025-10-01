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
import { assertIsNotProductionRuntime, assertUsage } from './utils.js'
import pc from '@brillout/picocolors'
import { pluginPreview } from './plugins/pluginPreview.js'
import { pluginDev } from './plugins/pluginDev.js'
import { pluginVirtualFiles } from './plugins/pluginVirtualFiles.js'
import { pluginExtractAssets } from './plugins/pluginExtractAssets.js'
import { pluginExtractExportNames } from './plugins/pluginExtractExportNames.js'
import { pluginSetGlobalContext } from './plugins/pluginSetGlobalContext.js'
import { pluginCommon } from './plugins/pluginCommon.js'
import { pluginBaseUrls } from './plugins/pluginBaseUrls.js'
import { pluginReplaceConstantsEnvVars } from './plugins/pluginReplaceConstantsEnvVars.js'
import { pluginFileEnv } from './plugins/pluginFileEnv.js'
import { pluginWorkaroundCssModuleHmr } from './plugins/pluginWorkaroundCssModuleHmr.js'
import { pluginWorkaroundVite6HmrRegression } from './plugins/pluginWorkaroundVite6HmrRegression.js'
import { pluginReplaceConstantsPageContext } from './plugins/pluginReplaceConstantsPageContext.js'
import { pluginReplaceConstantsGlobalThis } from './plugins/pluginReplaceConstantsGlobalThis.js'
import { pluginViteRPC } from './plugins/non-runnable-dev/pluginViteRPC.js'
import { pluginBuildApp } from './plugins/build/pluginBuildApp.js'
import { pluginDistPackageJsonFile } from './plugins/build/pluginDistPackageJsonFile.js'
import { pluginSuppressRollupWarning } from './plugins/build/pluginSuppressRollupWarning.js'
import { pluginDistFileNames } from './plugins/build/pluginDistFileNames.js'
import { pluginProdBuildEntry } from './plugins/build/pluginProdBuildEntry.js'
import { pluginBuildConfig } from './plugins/build/pluginBuildConfig.js'
import { pluginModuleBanner } from './plugins/build/pluginModuleBanner.js'
import { pluginReplaceConstantsNonRunnableDev } from './plugins/non-runnable-dev/pluginReplaceConstantsNonRunnableDev.js'

// We don't call this in ./onLoad.ts to avoid a cyclic dependency with utils.ts
setGetClientEntrySrcDev(getClientEntrySrcDev)
assertIsNotProductionRuntime()

type PluginInterop = Record<string, unknown> & { name: string }
// Return `PluginInterop` instead of `Plugin` to avoid type mismatch upon different Vite versions
async function plugin(vikeVitePluginOptions: VikeVitePluginOptions = {}): Promise<PluginInterop[]> {
  const plugins: Plugin[] = [
    ...pluginCommon(vikeVitePluginOptions),
    ...pluginVirtualFiles(),
    ...pluginDev(),
    ...pluginBuild(),
    ...pluginPreview(),
    ...pluginExtractAssets(),
    ...pluginExtractExportNames(),
    ...pluginSetGlobalContext(),
    ...pluginBaseUrls(),
    ...pluginReplaceConstantsEnvVars(),
    ...pluginFileEnv(),
    ...pluginWorkaroundCssModuleHmr(),
    ...pluginWorkaroundVite6HmrRegression(),
    ...pluginReplaceConstantsPageContext(),
    ...pluginReplaceConstantsGlobalThis(),
    ...pluginNonRunnabeDev(),
  ]
  Object.assign(plugins, { _vikeVitePluginOptions: vikeVitePluginOptions })
  return plugins as any
}

function pluginBuild(): Plugin[] {
  return [
    ...pluginBuildConfig(),
    ...pluginBuildApp(),
    ...pluginProdBuildEntry(),
    ...pluginDistPackageJsonFile(),
    ...pluginSuppressRollupWarning(),
    ...pluginDistFileNames(),
    ...pluginModuleBanner(),
  ]
}

function pluginNonRunnabeDev() {
  return [...pluginViteRPC(), ...pluginReplaceConstantsNonRunnableDev()]
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
