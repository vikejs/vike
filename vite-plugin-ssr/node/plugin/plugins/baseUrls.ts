export { baseUrls }

import type { Plugin } from 'vite'
import { resolveBaseFromUserConfig } from '../plugins/config/resolveBase'
import { assert } from '../utils'
import { getConfigVps } from './config/assertConfigVps'
import type { ConfigVpsUserProvided } from './config/ConfigVps'

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
        envPrefix: ['BASE_SERVER', 'BASE_ASSETS'],
        // Make Vite inject baseAssets to imports e.g. `import logoUrl from './logo.svg'`
        base: baseAssets
      }
    },
    async configResolved(config) {
      const configVps = await getConfigVps(config)
      // Ensure that the premature base URL resolving we did in config() isn't erroneous
      assert(configVps.baseServer === baseServer)
      assert(configVps.baseAssets === baseAssets)
      assert(config.base === baseAssets)
    }
  }
}
