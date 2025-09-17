export { pluginReplaceConstantsGlobalThis }

import type { Plugin } from 'vite'
import { assert, isDebug, addVirtualFileIdPrefix, isVirtualFileId, removeVirtualFileIdPrefix, escapeRegex } from '../utils.js'

declare global {
  /** Like `import.meta.env.DEV` but works inside `node_modules/` (even if package is `ssr.external`). The value `undefined` is to be interpreted as `false`. */
  var __VIKE__IS_DEV: boolean | undefined
  /** Like `import.meta.env.SSR` but works inside `node_modules/` (even if package is `ssr.external`). The value `undefined` is to be interpreted as `false`. */
  var __VIKE__IS_CLIENT: boolean | undefined
  /**
   * Whether a debug flag is enabled (either the global flag `DEBUG=vike` or a specific flag `DEBUG=vike:some-flag`).
   *
   * WARNING: must be used ONLY on the client-side. (The value is always `undefined` on the server-side.)
   *
   * In isomorhpic code, use `globalThis.__VIKE__IS_CLIENT` to make sure it's only used on the client-side.
   */
  var __VIKE__IS_DEBUG: boolean | undefined
}

// === Virtual Module Approach (NEW)
// This plugin now provides a virtual module 'virtual:vike:constants' that exports:
// - __VIKE__IS_DEV: boolean
// - __VIKE__IS_CLIENT: boolean
// - __VIKE__IS_DEBUG: boolean | undefined
//
// Benefits of virtual module approach:
// 1. Works reliably in production with ssr.external (no undefined values)
// 2. Provides proper TypeScript support
// 3. Enables tree-shaking optimizations
// 4. More explicit imports vs global variables
//
// Usage:
// import { __VIKE__IS_DEV, __VIKE__IS_CLIENT, __VIKE__IS_DEBUG } from 'virtual:vike:constants'

// === Legacy globalThis Approach (BACKWARD COMPATIBILITY)
// The plugin still sets globalThis variables for backward compatibility:
//
// === Explanation: globalThis.__VIKE__IS_DEV
// If client-side => always noExternal => globalThis.__VIKE__IS_DEV is set by the `define` config below.
// If server-side:
//   If ssr.noExternal => globalThis.__VIKE__IS_DEV is set by the `define` config below.
//   If `ssr.external`:
//     If not RunnableDevEnvironment (e.g. `@cloudflare/vite-plugin`) => always ssr.noExternal => globalThis.__VIKE__IS_DEV is set by the `define` config below.
//     If RunnableDevEnvironment (the default setup):
//       If dev/preview/pre-rendering => Vite is loaded, and server and Vite run inside the same process (because RunnableDevEnvironment) => globalThis.__VIKE__IS_DEV is set by the assignment below.
//       If production => Vite isn't loaded => globalThis.__VIKE__IS_DEV is `undefined` (it's never set) => value `undefined` is to be interpreted as `false`.
//       NOTE: With virtual module, this issue is resolved as the module provides reliable values.

// === Explanation: globalThis.__VIKE__IS_CLIENT
// If client-side => always noExternal => globalThis.__VIKE__IS_CLIENT is set to `true` by the `define` config below.
// If server-side => globalThis.__VIKE__IS_CLIENT is either `false` or `undefined` (the value `undefined` is to be interpreted as `false`).

globalThis.__VIKE__IS_CLIENT = false

// Virtual module ID for constants
const VIRTUAL_MODULE_ID = 'virtual:vike:constants'

const filterRolldown = {
  id: {
    include: new RegExp(`^${escapeRegex(VIRTUAL_MODULE_ID)}`),
  },
}
const filterFunction = (id: string) => id === VIRTUAL_MODULE_ID || id === addVirtualFileIdPrefix(VIRTUAL_MODULE_ID)

function pluginReplaceConstantsGlobalThis(): Plugin[] {
  let isDev: boolean
  return [
    {
      name: 'vike:pluginReplaceConstantsGlobalThis',
      config: {
        handler(config) {
          isDev = config._isDev
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
          const defineIsDebug = !isClientSide
            ? {}
            : {
                // We purposely only define it on the client-side, because we cannot know the value in server-side ssr.external production.
                'globalThis.__VIKE__IS_DEBUG': JSON.stringify(isDebug()),
              }
          return {
            define: {
              'globalThis.__VIKE__IS_CLIENT': JSON.stringify(isClientSide),
              ...defineIsDebug,
            },
          }
        },
      },
      resolveId: {
        filter: filterRolldown,
        handler(id) {
          if (filterFunction(id)) {
            return addVirtualFileIdPrefix(id)
          }
        },
      },
      load: {
        filter: filterRolldown,
        handler(id, options) {
          if (!filterFunction(id)) return
          id = removeVirtualFileIdPrefix(id)

          const consumer: 'server' | 'client' = this.environment?.config?.consumer ??
            (this.environment?.name === 'client' ? 'client' : 'server')
          const isClientSide = consumer === 'client'

          // Generate the virtual module content
          const lines: string[] = []
          lines.push('// Virtual module providing Vike constants')
          lines.push('')
          lines.push(`export const __VIKE__IS_DEV: boolean = ${JSON.stringify(isDev ?? false)};`)
          lines.push(`export const __VIKE__IS_CLIENT: boolean = ${JSON.stringify(isClientSide)};`)

          if (isClientSide) {
            // Only provide debug flag on client-side
            lines.push(`export const __VIKE__IS_DEBUG: boolean = ${JSON.stringify(isDebug())};`)
          } else {
            // On server-side, debug is always undefined/false
            lines.push(`export const __VIKE__IS_DEBUG: boolean | undefined = undefined;`)
          }

          lines.push('')
          lines.push('// Backward compatibility: also set globalThis values')
          lines.push(`globalThis.__VIKE__IS_DEV = ${JSON.stringify(isDev ?? false)};`)
          lines.push(`globalThis.__VIKE__IS_CLIENT = ${JSON.stringify(isClientSide)};`)
          if (isClientSide) {
            lines.push(`globalThis.__VIKE__IS_DEBUG = ${JSON.stringify(isDebug())};`)
          }

          return lines.join('\n')
        },
      },
    },
  ]
}
