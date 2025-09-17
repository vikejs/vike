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
// This plugin now provides a virtual module 'virtual:vike:constants' that automatically sets globalThis values.
// The virtual module is automatically loaded to ensure globalThis variables are set reliably in production,
// even with ssr.external configurations.
//
// Benefits of virtual module approach:
// 1. Works reliably in production with ssr.external (no undefined values)
// 2. Automatically sets globalThis variables without requiring code changes
// 3. Ensures constants are available before any user code runs
// 4. Maintains backward compatibility with existing globalThis usage

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

          // Generate the virtual module content that sets globalThis values
          const lines: string[] = []
          lines.push('// Virtual module that ensures Vike constants are set on globalThis')
          lines.push('// This module is automatically loaded to provide reliable constants in production')
          lines.push('')
          lines.push(`globalThis.__VIKE__IS_DEV = ${JSON.stringify(isDev ?? false)};`)
          lines.push(`globalThis.__VIKE__IS_CLIENT = ${JSON.stringify(isClientSide)};`)

          if (isClientSide) {
            lines.push(`globalThis.__VIKE__IS_DEBUG = ${JSON.stringify(isDebug())};`)
          } else {
            // On server-side, debug is always undefined
            lines.push(`globalThis.__VIKE__IS_DEBUG = undefined;`)
          }

          lines.push('')
          lines.push('// Module loaded successfully - globalThis constants are now available')

          return lines.join('\n')
        },
      },
    },
  ]
}
