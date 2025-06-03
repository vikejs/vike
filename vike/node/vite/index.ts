export default plugin
export { plugin }
// TODO/v1-release: remove
export { plugin as ssr }
export { getVikeConfig } from './shared/resolveVikeConfig.js'
export { PROJECT_VERSION as version } from './utils.js'
export type { VikeVitePluginOptions as UserConfig }
export type { VikeVitePluginOptions }

import { type Plugin } from 'vite'
import { assertUsage } from './utils.js'
import { build } from './plugins/build.js'
import { pluginPreview } from './plugins/pluginPreview.js'
import { devConfig } from './plugins/devConfig/index.js'
import { virtualFilesPlugin } from './plugins/virtualFilesPlugin/index.js'
import { pluginExtractAssets } from './plugins/pluginExtractAssets.js'
import { pluginExtractExportNames } from './plugins/pluginExtractExportNames.js'
import { setGlobalContext } from './plugins/setGlobalContext.js'
import { pluginCommon } from './plugins/pluginCommon.js'
import { baseUrls } from './plugins/baseUrls.js'
import { pluginEnvVars } from './plugins/pluginEnvVars.js'
import pc from '@brillout/picocolors'
import { fileEnv } from './plugins/fileEnv.js'
import { setResolveClientEntriesDev } from '../runtime/renderPage/getPageAssets.js'
import { resolveClientEntriesDev } from './shared/resolveClientEntriesDev.js'
import { workaroundCssModuleHmr } from './plugins/workaroundCssModuleHmr.js'
import { workaroundVite6HmrRegression } from './plugins/workaroundVite6HmrRegression.js'
import { replaceConstants } from './plugins/replaceConstants.js'

// We don't call this in ./onLoad.ts to avoid a cyclic dependency with utils.ts
setResolveClientEntriesDev(resolveClientEntriesDev)

type PluginInterop = Record<string, unknown> & { name: string }
// Return `PluginInterop` instead of `Plugin` to avoid type mismatch upon different Vite versions
function plugin(vikeVitePluginOptions: VikeVitePluginOptions = {}): PluginInterop[] {
  const plugins: Plugin[] = [
    ...pluginCommon(vikeVitePluginOptions),
    virtualFilesPlugin(),
    ...devConfig(),
    ...build(),
    pluginPreview(),
    ...pluginExtractAssets(),
    pluginExtractExportNames(),
    ...setGlobalContext(),
    baseUrls(),
    pluginEnvVars(),
    fileEnv(),
    workaroundCssModuleHmr(),
    workaroundVite6HmrRegression(),
    replaceConstants()
  ]
  Object.assign(plugins, { _vikeVitePluginOptions: vikeVitePluginOptions })
  return plugins as any
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

// CJS default export `const vike = require('vike/plugin')`
//  - It needs to live at the end of this file, in order to ensure we do it after all assignments to `exports`.
try {
  module.exports = Object.assign(exports.default, exports)
} catch {}
