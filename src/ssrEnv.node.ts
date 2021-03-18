import { ViteDevServer } from 'vite'

export { setSsrEnv }
export { getSsrEnv }
export { SsrEnv }

type SsrEnv =
  | {
      root: string
      isProduction?: false
      viteDevServer: ViteDevServer
    }
  | {
      root: string
      isProduction: true
      viteDevServer?: undefined
    }

function getSsrEnv(): SsrEnv {
  //@ts-ignore
  return global.__vite_ssr_plugin
}

function setSsrEnv(ssrEnv: SsrEnv) {
  //@ts-ignore
  global.__vite_ssr_plugin = ssrEnv
}
