export { baseUrls }

import type { Plugin } from 'vite'
import { resolveBaseFromUserConfig } from '../plugins/config/resolveBase.js'
import { assert } from '../utils.js'
import { getConfigVps } from '../../shared/getConfigVps.js'
import type { ConfigVpsUserProvided } from '../../../shared/ConfigVps.js'

function baseUrls(configVps?: ConfigVpsUserProvided): Plugin {
  let baseServer: string
  let baseAssets: string
  return {
    name: 'vite-plugin-ssr:baseUrls',
    enforce: 'post',
    config: (config) => {
      const bases = resolveBaseFromUserConfig(config, configVps)
      baseServer = bases.baseServer
      baseAssets = bases.baseAssets
      // We cannot define these in configResolved() because Vite picks up the env variables before any configResolved() hook is called
      process.env.BASE_SERVER = baseServer
      process.env.BASE_ASSETS = baseAssets
      return {
        envPrefix: [
          'VITE_', // Vite doesn't seem to merge in its default, see https://github.com/brillout/vite-plugin-ssr/issues/554
          'BASE_SERVER',
          'BASE_ASSETS'
        ],
        base: baseAssets, // Make Vite inject baseAssets to imports e.g. `import logoUrl from './logo.svg.js'`
        _baseOriginal: config.base ?? '/__UNSET__' // Vite resolves `_baseOriginal: null` to `undefined`
      }
    },
    async configResolved(config) {
      const configVps = await getConfigVps(config)
      // Ensure that the premature base URL resolving we did in config() isn't erroneous
      assert(configVps.baseServer === baseServer)
      assert(configVps.baseAssets === baseAssets)
      /* In dev, Vite seems buggy around setting vite.config.js#base to an absolute URL (e.g. http://localhost:8080/cdn/)
       *  - In dev, Vite removes the URL origin. (I.e. it resolves the user config `vite.config.js#base: 'http://localhost:8080/cdn/'` to resolved config `config.base === '/cdn/'`.)
       *  - Instead of having an internal VPS assertion fail, we let the user discover Vite's buggy behavior.
      assert(config.base === baseAssets)
      */
    }
  }
}
