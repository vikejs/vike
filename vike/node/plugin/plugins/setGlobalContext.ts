export { setGlobalContext }

import type { Plugin } from 'vite'
import { setGlobalContext_isDev, setGlobalContext_viteDevServer } from '../../runtime/globalContext.js'
import { isDev3 } from '../utils.js'

function setGlobalContext(): Plugin {
  return {
    name: 'vike:setGlobalContext',
    enforce: 'pre',
    configureServer: {
      order: 'pre',
      handler(viteDevServer) {
        setGlobalContext_viteDevServer(viteDevServer)
      }
    },
    config: {
      handler(_, env) {
        const isDev = isDev3(env)
        setGlobalContext_isDev(isDev)
      }
    }
  }
}
