import { ViteDevServer } from 'vite'

export { setGlobal }
export { getGlobal }

type GlobalInfo = {
  isProduction?: boolean
  viteDevServer: ViteDevServer
  root: string
}

function getGlobal(): GlobalInfo {
  //@ts-ignore
  return global.__vite_ssr_plugin
}

function setGlobal(globalInfo: GlobalInfo) {
  //@ts-ignore
  global.__vite_ssr_plugin = globalInfo
}
