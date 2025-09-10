export { pluginReplaceGlobalThisConstants }

import type { Plugin } from 'vite'
import { assert } from '../utils.js'

declare global {
  /** Like `import.meta.env.DEV` but works inside `node_modules/` (even if package is `ssr.external`). The value `undefined` is to be interpreted as `false`. */
  var __VIKE__IS_DEV: boolean | undefined
  /** Like `import.meta.env.SSR` but works inside `node_modules/` (even if package is `ssr.external`). The value `undefined` is to be interpreted as `false`. */
  var __VIKE__IS_CLIENT: boolean | undefined
}

// If client-side => always noExternal => globalThis.{__VIKE__IS_CLIENT,__VIKE__IS_DEV} are set by the `define` config below.
// If server-side:
//   If not RunnableDevEnvironment (e.g. `@cloudflare/vite-plugin`) => always ssr.noExternal => globalThis.{__VIKE__IS_CLIENT,__VIKE__IS_DEV} are set by the `define` config below.
//   If RunnableDevEnvironment (the default setup):
//     If ssr.noExternal => globalThis.{__VIKE__IS_CLIENT,__VIKE__IS_DEV} are set by the `define` config below.
//     If `ssr.external`:
//       If Vite is loaded => Vite and server run inside the same process (because RunnableDevEnvironment) => globalThis.{__VIKE__IS_CLIENT,__VIKE__IS_DEV} are set by the assignments below.
//       If Vite isn't loaded => production and globalThis.{__VIKE__IS_CLIENT,__VIKE__IS_DEV} is never set => value `undefined` is to be interpreted as `false`.

globalThis.__VIKE__IS_CLIENT = false

function pluginReplaceGlobalThisConstants(): Plugin[] {
  return [
    {
      name: 'vike:pluginReplaceGlobalThisConstants',
      config: {
        handler(config) {
          const isDev = config._isDev
          assert(typeof isDev === 'boolean')
          globalThis.__VIKE__IS_DEV = isDev
          return {
            define: {
              'globalThis.__VIKE__IS_DEV': JSON.stringify(isDev),
            },
          }
        },
      },
      configEnvironment: {
        handler(name, config) {
          const consumer: 'server' | 'client' = config.consumer ?? (name === 'client' ? 'client' : 'server')
          const isClientSide = consumer === 'client'
          return {
            define: {
              'globalThis.__VIKE__IS_CLIENT': JSON.stringify(isClientSide),
            },
          }
        },
      },
    },
  ]
}
