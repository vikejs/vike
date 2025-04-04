export { setGlobalContext }

import type { Plugin, ResolvedConfig } from 'vite'
import {
  setGlobalContext_viteDevServer,
  setGlobalContext_viteConfig,
  setGlobalContext_isProduction
} from '../../runtime/globalContext.js'
import {
  assert,
  isDevCheck,
  markSetup_isViteDev,
  markSetup_viteDevServer,
  markSetup_vitePreviewServer
} from '../utils.js'
import { reloadVikeConfig } from './importUserCode/v1-design/getVikeConfig.js'
import { getViteConfigRuntime } from '../shared/getViteConfigRuntime.js'

function setGlobalContext(): Plugin[] {
  let isServerReload = false
  let config: ResolvedConfig
  return [
    {
      name: 'vike:setGlobalContext:pre',
      enforce: 'pre',
      // This hook is called not only at server start but also at server restart (a new `viteDevServer` instance is created)
      configureServer: {
        order: 'pre',
        handler(viteDevServer) {
          assert(config)
          if (isServerReload) reloadVikeConfig(config)
          isServerReload = true
          setGlobalContext_viteDevServer(viteDevServer)
          markSetup_viteDevServer()
        }
      },
      configurePreviewServer() {
        markSetup_vitePreviewServer()
      },
      config: {
        order: 'pre',
        handler(_, env) {
          const isViteDev = isDevCheck(env)
          setGlobalContext_isProduction(!isViteDev)
          markSetup_isViteDev(isViteDev)
        }
      }
    },
    {
      name: 'vike:setGlobalContext:post',
      enforce: 'post',
      configResolved: {
        order: 'post',
        async handler(config_) {
          config = config_
          const viteConfigRuntime = getViteConfigRuntime(config)
          setGlobalContext_viteConfig(config, viteConfigRuntime)
        }
      }
    }
  ]
}
