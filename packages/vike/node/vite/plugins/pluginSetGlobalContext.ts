export { pluginSetGlobalContext }

import type { Plugin, ViteDevServer } from 'vite'
import {
  setGlobalContext_viteDevServer,
  setGlobalContext_viteConfig,
  setGlobalContext_isProduction,
} from '../../runtime/globalContext.js'
import {
  assert,
  isDevCheck,
  markSetup_isViteDev,
  markSetup_viteDevServer,
  markSetup_vitePreviewServer,
} from '../utils.js'
import { reloadVikeConfig } from '../shared/resolveVikeConfigInternal.js'
import { getViteConfigRuntime } from '../shared/getViteConfigRuntime.js'

export type ViteRpcFunctions = ReturnType<typeof getRpcFunctions>
function getRpcFunctions(viteDevServer: ViteDevServer) {
  return {
    async transformIndexHtml(html: string) {
      return await viteDevServer.transformIndexHtml('/', html)
    },
  }
}

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
          createViteServerRPC(viteDevServer, getRpcFunctions)
          /*
          const { environments } = viteDevServer
          for (const envName in environments) {
            console.log('envName', envName)
            const env = environments[envName]!
            env.hot.on('vike:rpc:request', async (data, send) => {
              console.log('Event received vike:rpc:request')
              console.log(data)
              const { callId, arg } = data
              const fakeHtml = await viteDevServer.transformIndexHtml('/', arg)
              console.log('[vite] fakeHtml', fakeHtml)
              env.hot.send('vike:rpc:response', { callId, ret: fakeHtml })
            })
          }
          //*/
          if (isServerReload) reloadVikeConfig()
          isServerReload = true
          setGlobalContext_viteDevServer(viteDevServer)
          markSetup_viteDevServer()
        },
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

function createViteServerRPC(
  viteDevServer: ViteDevServer,
  getRpcFunctions: (viteDevServer: ViteDevServer) => Record<string, Function>,
) {
  const rpcFunctions = getRpcFunctions(viteDevServer)
  const { environments } = viteDevServer
  for (const envName in environments) {
    console.log('envName', envName)
    const env = environments[envName]!
    env.hot.on('vike:rpc:request', async (data) => {
      console.log('Request received', data)
      const { callId, functionName, functionArgs } = data
      const functionReturn = await rpcFunctions[functionName]!(...functionArgs)
      const dataResponse = { callId, functionReturn }
      console.log('Response sent', dataResponse)
      env.hot.send('vike:rpc:response', dataResponse)
    })
  }
}
