export { getViteDevScript }

import type { ViteRpcFunctions } from '../../../vite/plugins/pluginSetGlobalContext.js'
import type { GlobalContextServerInternal } from '../../globalContext.js'
import { assert, assertUsage, assertWarning, genPromise, getRandomId } from '../../utils.js'
import pc from '@brillout/picocolors'

const reachOutCTA = 'Create a new GitHub issue to discuss a solution.'

async function getViteDevScript(pageContext: {
  _globalContext: GlobalContextServerInternal
}): Promise<string> {
  const globalContext = pageContext._globalContext
  if (globalContext._isProduction) {
    return ''
  }
  // const { _viteDevServer: viteDevServer } = globalContext

  const fakeHtmlBegin = '<html> <head>' // White space to test whether user is using a minifier
  const fakeHtmlEnd = '</head><body></body></html>'
  let fakeHtml = fakeHtmlBegin + fakeHtmlEnd
  console.log('fakeHtml 1', fakeHtml)
  const rpc2 = createViteClientRPC<ViteRpcFunctions>()
  fakeHtml = await rpc2.transformIndexHtml(fakeHtml)
  console.log('fakeHtml 2', fakeHtml)
  // import.meta.hot!.send('vike:rpc:transformIndexHtml', fakeHtml)
  // fakeHtml = await viteDevServer.transformIndexHtml('/', fakeHtml)
  assertUsage(
    !fakeHtml.includes('vite-plugin-pwa'),
    `The HTML transformer of ${pc.cyan(
      'vite-plugin-pwa',
    )} cannot be applied, see workaround at https://github.com/vikejs/vike/issues/388#issuecomment-1199280084`,
  )
  assertUsage(
    !fakeHtml.startsWith(fakeHtmlBegin.replace(' ', '')),
    `Vite plugins that minify the HTML cannot be applied, see https://github.com/vikejs/vike/issues/224`,
  )
  assertUsage(
    fakeHtml.startsWith(fakeHtmlBegin) && fakeHtml.endsWith(fakeHtmlEnd),
    `You are using a Vite Plugin that transforms the HTML in a way that conflicts with Vike. ${reachOutCTA}`,
  )
  const viteInjection = fakeHtml.slice(fakeHtmlBegin.length, -1 * fakeHtmlEnd.length)
  // assert(viteInjection.includes('script'))
  assertWarning(!viteInjection.includes('import('), `Unexpected Vite injected HMR code. ${reachOutCTA}`, {
    onlyOnce: true,
  })

  const viteDevScript = viteInjection
  return viteDevScript
}

function createViteClientRPC<RpcFunctions>() {
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
  return rpc as RpcFunctions
}

/*
async function rpc(cmd: string, arg: string) {
  assert(import.meta.hot)
  const callId = getRandomId()
  const { promise, resolve } = genPromise<any>({ timeout: 3 * 1000 })
  const cb = (data: any) => {
    console.log('Response received', data)
    if (data.callId !== callId) return
    import.meta.hot!.off(cmd, cb)
    resolve(data.ret)
  }
  import.meta.hot.on(`vike:rpc:response`, cb)
  console.log("Sending event 'vike:rpc:request'")
  await import.meta.hot.send('vike:rpc:request', { callId, cmd, arg })
  return promise
}
//*/
