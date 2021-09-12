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
  return (global as any).__vite_ssr_plugin
}

function setSsrEnv(ssrEnv: SsrEnv) {
  (global as any).__vite_ssr_plugin = ssrEnv
}

/* We use `global as any` instead, because latest `@types/node` version `16.x.x` breaks `declare global`, see https://stackoverflow.com/questions/68481686/type-typeof-globalthis-has-no-index-signature
declare global {
  namespace NodeJS {
    interface Global {
      __vite_ssr_plugin: SsrEnv
    }
  }
}
*/
