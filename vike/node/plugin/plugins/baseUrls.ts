export { baseUrls }

import type { Plugin } from 'vite'
import { resolveBaseFromUserConfig } from '../plugins/config/resolveBase.js'
import { assert } from '../utils.js'
import { getConfigVike } from '../../shared/getConfigVike.js'
import type { ConfigVikeUserProvided } from '../../../shared/ConfigVike.js'

function baseUrls(configVike?: ConfigVikeUserProvided): Plugin {
  let baseServer: string
  let baseAssets: string
  return {
    name: 'vike:baseUrls',
    enforce: 'post',
    config: (config) => {
      const bases = resolveBaseFromUserConfig(config, configVike)
      baseServer = bases.baseServer
      baseAssets = bases.baseAssets
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
        _baseOriginal: config.base ?? '/__UNSET__' // Vite resolves `_baseOriginal: null` to `undefined`
      }
    },
    async configResolved(config) {
      const configVike = await getConfigVike(config)
      // Ensure that the premature base URL resolving we did in config() isn't erroneous
      assert(configVike.baseServer === baseServer)
      assert(configVike.baseAssets === baseAssets)
      /* In dev, Vite seems buggy around setting vite.config.js#base to an absolute URL (e.g. http://localhost:8080/cdn/)
       *  - In dev, Vite removes the URL origin. (I.e. it resolves the user config `vite.config.js#base: 'http://localhost:8080/cdn/'` to resolved config `config.base === '/cdn/'`.)
       *  - Instead of having an internal Vike assertion fail, we let the user discover Vite's buggy behavior.
      assert(config.base === baseAssets)
      */
    }
  }
}
