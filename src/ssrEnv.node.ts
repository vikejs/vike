import { ViteDevServer } from 'vite'
import { RoutingHandler } from './routing/types';

export { setSsrEnv }
export { getSsrEnv }
export { SsrEnv }

type SsrEnv =
  | {
      isProduction: false
      viteDevServer: ViteDevServer
      root: string
      baseUrl: string,
      customRouting?: RoutingHandler
    }
  | {
      isProduction: true
      viteDevServer: undefined
      root?: string
      baseUrl: string
      customRouting?: RoutingHandler
    }

function getSsrEnv(): SsrEnv {
  return global.__vite_ssr_plugin
}

function setSsrEnv(ssrEnv: SsrEnv) {
  global.__vite_ssr_plugin = ssrEnv
}

declare global {
  namespace NodeJS {
    interface Global {
      __vite_ssr_plugin: SsrEnv
    }
  }
}
