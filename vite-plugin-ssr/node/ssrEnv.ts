import { ViteDevServer } from 'vite'

export { setSsrEnv }
export { getSsrEnv }
export type { SsrEnv }

type SsrEnv =
  | {
      isProduction: false
      viteDevServer: ViteDevServer
      root: string
      baseUrl: string
    }
  | {
      isProduction: true
      viteDevServer: undefined
      root?: string | undefined
      baseUrl: string
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
