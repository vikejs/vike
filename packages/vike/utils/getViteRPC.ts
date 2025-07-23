export { getViteRPC } // consumer (aka RPC client)
export { createViteRPC } // provider (aka RPC server)

import type { ViteDevServer } from 'vite'
import { assert } from './assert.js'
import { genPromise } from './genPromise.js'
import { getRandomId } from './getRandomId.js'
import { getGlobalObject } from './getGlobalObject.js'
import { createDebugger } from './debug.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
assertIsNotBrowser()
const globalContext = getGlobalObject('utils/getViteRPC.ts', {
  rpc: null as null | object,
})
const debug = createDebugger('vike:vite-rpc')

type DataRequest = { callId: string; functionName: string; functionArgs: unknown[] }
type DataResponse = { callId: string; functionReturn: unknown }

function getViteRPC<RpcFunctions>() {
  globalContext.rpc ??= createRpcClient()
  return globalContext.rpc as RpcFunctions
}

function createRpcClient() {
  return {} as any
}

type AsyncFunction = (...args: any[]) => Promise<unknown>
function createViteRPC(
  viteDevServer: ViteDevServer,
  getRpcFunctions: (viteDevServer: ViteDevServer) => Record<string, AsyncFunction>,
) {}
