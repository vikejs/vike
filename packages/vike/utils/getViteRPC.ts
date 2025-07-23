export { getViteRPC } // consumer (aka client)
export { createViteRPC } // provider (aka server)

import type { ViteDevServer } from 'vite'
import { assert } from './assert.js'
import { genPromise } from './genPromise.js'
import { getRandomId } from './getRandomId.js'
import { getGlobalObject } from './getGlobalObject.js'

const globalContext = getGlobalObject('utils/getViteRPC.ts', {
  rpc: null as null | object,
})

function getViteRPC<RpcFunctions>() {
  globalContext.rpc ??= createRpcClient()
  return globalContext.rpc as RpcFunctions
}

function createRpcClient() {
  assert(import.meta.hot)
  const callbacks: { callId: string; cb: (ret: unknown) => void }[] = []
  import.meta.hot.on(`vike:rpc:response`, (data) => {
    console.log('Response received', data)
    const { callId, functionReturn } = data
    callbacks.forEach((c) => {
      if (callId !== c.callId) return
      c.cb(functionReturn)
      callbacks.splice(callbacks.indexOf(c), 1)
    })
  })
  const rpc = new Proxy(
    {},
    {
      get(_, functionName) {
        return async (...functionArgs: unknown[]) => {
          const callId = getRandomId()
          const { promise, resolve } = genPromise<unknown>({ timeout: 3 * 1000 })
          callbacks.push({
            callId,
            cb: (functionReturn: unknown) => {
              resolve(functionReturn)
            },
          })
          const data = { callId, functionName, functionArgs }
          console.log('Request sent', data)
          await import.meta.hot!.send('vike:rpc:request', data)
          const functionReturn = await promise
          return functionReturn
        }
      },
    },
  )
  return rpc
}

function createViteRPC(
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
