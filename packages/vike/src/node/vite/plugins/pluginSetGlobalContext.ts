export { pluginSetGlobalContext }

import type { Plugin } from 'vite'
import {
  setGlobalContext_viteDevServer,
  setGlobalContext_viteConfig,
  setGlobalContext_isProductionAccordingToVite,
} from '../../../server/runtime/globalContext.js'
import {
  markSetup_isViteDev,
  markSetup_viteDevServer,
  markSetup_vitePreviewServer,
} from '../../../utils/assertSetup.js'
import { isDevCheck } from '../../../utils/isDev.js'
import { reloadVikeConfig } from '../shared/resolveVikeConfigInternal.js'
import { getViteConfigRuntime } from '../shared/getViteConfigRuntime.js'
import '../assertEnvVite.js'

function pluginSetGlobalContext(): Plugin[] {
  let isServerReload = false
  return [
    {
      name: 'vike:pluginSetGlobalContext:pre',
      enforce: 'pre',
      // This hook is called not only at server start but also at server restart (a new `viteDevServer` instance is created)
      configureServer: {
        order: 'pre',
        handler(viteDevServer) {
          if (isServerReload) reloadVikeConfig()
          isServerReload = true
          setGlobalContext_viteDevServer(viteDevServer)
          markSetup_viteDevServer()
        },
      },
      configurePreviewServer: {
        handler() {
          markSetup_vitePreviewServer()
        },
      },
      config: {
        order: 'pre',
        handler(_, env) {
          const isViteDev = isDevCheck(env)
          setGlobalContext_isProductionAccordingToVite(!isViteDev)
          markSetup_isViteDev(isViteDev)
        },
      },
    },
    {
      name: 'vike:pluginSetGlobalContext:post',
      enforce: 'post',
      configResolved: {
        order: 'post',
        async handler(config) {
          const viteConfigRuntime = getViteConfigRuntime(config)
          setGlobalContext_viteConfig(config, viteConfigRuntime)
        },
      },
    },
  ]
}
