export { baseUrls }

import type { Plugin } from 'vite'
import { resolveBase, resolveBaseFromResolvedConfig } from '../../shared/resolveBase.js'
import { assert } from '../utils.js'
import { getVikeConfig, getVikeConfig2 } from './importUserCode/v1-design/getVikeConfig.js'

function baseUrls(vikeVitePluginOptions: unknown): Plugin {
  let basesResolved: ReturnType<typeof resolveBase>
  let root: string
  return {
    name: 'vike:baseUrls',
    enforce: 'post',
    async config(config) {
      const isDev = config._isDev
      assert(typeof isDev === 'boolean')
      assert(config.root)
      root = config.root
      const baseViteOriginal = config.base ?? '/__UNSET__' // '/__UNSET__' because Vite resolves `_baseViteOriginal: null` to `undefined`
      const vikeConfig = await getVikeConfig2(root, isDev, vikeVitePluginOptions)
      basesResolved = resolveBase(
        baseViteOriginal,
        vikeConfig.vikeConfigGlobal.baseServer,
        vikeConfig.vikeConfigGlobal.baseAssets
      )
      // We cannot define these in configResolved() because Vite picks up the env variables before any configResolved() hook is called
      process.env.BASE_SERVER = basesResolved.baseServer
      process.env.BASE_ASSETS = basesResolved.baseAssets
      return {
        envPrefix: [
          'VITE_', // Vite doesn't seem to merge in its default, see https://github.com/vikejs/vike/issues/554
          'BASE_SERVER',
          'BASE_ASSETS'
        ],
        base: basesResolved.baseAssets, // Make Vite inject baseAssets to imports e.g. `import logoUrl from './logo.svg.js'`
        _baseViteOriginal: baseViteOriginal
      }
    },
    async configResolved(config) {
      assert(root === config.root)
      const vikeConfig = await getVikeConfig(config)
      const basesResolved2 = resolveBaseFromResolvedConfig(
        vikeConfig.vikeConfigGlobal.baseServer,
        vikeConfig.vikeConfigGlobal.baseAssets,
        config
      )
      assert(basesResolved2.baseServer === basesResolved.baseServer)
      assert(basesResolved2.baseAssets === basesResolved.baseAssets)
      /* In dev, Vite seems buggy around setting vite.config.js#base to an absolute URL (e.g. http://localhost:8080/cdn/)
       *  - In dev, Vite removes the URL origin. (I.e. it resolves the user config `vite.config.js#base: 'http://localhost:8080/cdn/'` to resolved config `config.base === '/cdn/'`.)
       *  - Instead of having an internal Vike assertion fail, we let the user discover Vite's buggy behavior.
      assert(config.base === baseAssets)
      */
    }
  }
}
