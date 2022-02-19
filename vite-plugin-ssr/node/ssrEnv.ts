import type { ViteDevServer } from 'vite'
import { assertBaseUrl } from './utils'

export { setSsrEnv }
export { getSsrEnv }
export type { SsrEnv }

type SsrEnv =
  | {
      isProduction: false
      viteDevServer: ViteDevServer
      root: string
      outDir: string
      baseUrl: string
      baseAssets: string | null
    }
  | {
      isProduction: true
      viteDevServer: undefined
      root?: string | undefined
      outDir: string
      baseUrl: string
      baseAssets: string | null
    }

function getSsrEnv(): SsrEnv {
  const ssrEnv = global.__vite_ssr_plugin
  assertBaseUrl(ssrEnv.baseUrl)
  return ssrEnv
}

function setSsrEnv(ssrEnv: SsrEnv) {
  assertBaseUrl(ssrEnv.baseUrl)
  global.__vite_ssr_plugin = ssrEnv
}

// https://stackoverflow.com/questions/68481686/type-typeof-globalthis-has-no-index-signature/69238076#69238076
declare global {
  var __vite_ssr_plugin: SsrEnv
}
