export { pluginReplaceGlobalThisConstants }

import type { Plugin } from 'vite'
import { assert } from '../utils.js'

declare global {
  /** Like `import.meta.env.DEV` but works inside `node_modules/` (even if package is `ssr.external`). If value is `undefined` then interpret it as `false`. */
  var __VIKE__IS_DEV: boolean | undefined
  /** Like `import.meta.env.SSR` but works inside `node_modules/` (even if package is `ssr.external`). If value is `undefined` then interpret it as `false`. */
  var __VIKE__IS_CLIENT: boolean | undefined
}

// If client-side => always ssr.noExternal => globalThis.{__VIKE__IS_CLIENT,__VIKE__IS_DEV} are set by the `define` config below.
// If server-side:
//   If package is ssr.noExternal => globalThis.{__VIKE__IS_CLIENT,__VIKE__IS_DEV} are set by the `define` config below.
//   If package is `ssr.external`:
//     If Vite isn't loaded => production => `globalThis.{__VIKE__IS_CLIENT,__VIKE__IS_DEV} === undefined` => checking for `!globalThis.{__VIKE__IS_CLIENT,__VIKE__IS_DEV}` is accurate.
//     If Vite is loaded:
//       If RunnableDevEnvironment => globalThis.{__VIKE__IS_CLIENT,__VIKE__IS_DEV} are set by the assignments below.
//       If not RunnableDevEnvironment => packages are always ssr.noExternal => globalThis.{__VIKE__IS_CLIENT,__VIKE__IS_DEV} are set by the `define` config below.

globalThis.__VIKE__IS_CLIENT = false

function pluginReplaceGlobalThisConstants(): Plugin[] {
  return [
    {
      name: 'vike:pluginReplaceGlobalThisConstants',
      config: {
        handler(config) {
          const isDev = config._isDev
          assert(typeof isDev === 'boolean')
          // If Vite isn't loaded => production => `globalThis.__VIKE__IS_DEV === undefined` => checking for `!globalThis.__VIKE__IS_DEV` is accurate.
          // If Vite is loaded: see comment above about `globalThis.__VIKE__IS_CLIENT`.
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
