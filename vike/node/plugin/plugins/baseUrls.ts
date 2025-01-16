export { baseUrls }

import type { Plugin, UserConfig } from 'vite'
import { resolveBase, resolveBaseFromResolvedConfig } from '../../shared/resolveBase.js'
import { assert } from '../utils.js'
import type { ConfigVikeUserProvided } from '../../../shared/ConfigVike.js'
import { getVikeConfig } from './importUserCode/v1-design/getVikeConfig.js'

function baseUrls(vikeVitePluginOptions?: ConfigVikeUserProvided): Plugin {
  let bases: ReturnType<typeof resolveBaseFromUserConfig>
  return {
    name: 'vike:baseUrls',
    enforce: 'post',
    async config(config) {
      // TODO: fix bug: use getVikeConfig2() and udpate check below
      bases = resolveBaseFromUserConfig(config, vikeVitePluginOptions)
      const { baseServer, baseAssets } = bases
      // We cannot define these in configResolved() because Vite picks up the env variables before any configResolved() hook is called
      process.env.BASE_SERVER = baseServer
      process.env.BASE_ASSETS = baseAssets
      return {
        envPrefix: [
          'VITE_', // Vite doesn't seem to merge in its default, see https://github.com/vikejs/vike/issues/554
          'BASE_SERVER',
          'BASE_ASSETS'
        ],
        base: baseAssets, // Make Vite inject baseAssets to imports e.g. `import logoUrl from './logo.svg.js'`
        _baseViteOriginal: config.base ?? '/__UNSET__' // Vite resolves `_baseViteOriginal: null` to `undefined`
      }
    },
    async configResolved(config) {
      const vikeConfig = await getVikeConfig(config)
      const { baseServer, baseAssets } = vikeConfig.vikeConfigGlobal
      const basesResolved = resolveBaseFromResolvedConfig(baseServer, baseAssets, config)
      // Ensure that the premature base URL resolving we did in config() isn't erroneous
      assert(basesResolved.baseServer === bases.baseServer)
      assert(basesResolved.baseAssets === bases.baseAssets)
      /* In dev, Vite seems buggy around setting vite.config.js#base to an absolute URL (e.g. http://localhost:8080/cdn/)
       *  - In dev, Vite removes the URL origin. (I.e. it resolves the user config `vite.config.js#base: 'http://localhost:8080/cdn/'` to resolved config `config.base === '/cdn/'`.)
       *  - Instead of having an internal Vike assertion fail, we let the user discover Vite's buggy behavior.
      assert(config.base === baseAssets)
      */
    }
  }
}

function resolveBaseFromUserConfig(config: UserConfig, vikeVitePluginOptions: undefined | ConfigVikeUserProvided) {
  const baseViteOriginal = config.base ?? null
  return resolveBase(
    baseViteOriginal,
    vikeVitePluginOptions?.baseServer ?? null,
    vikeVitePluginOptions?.baseAssets ?? null
  )
}
