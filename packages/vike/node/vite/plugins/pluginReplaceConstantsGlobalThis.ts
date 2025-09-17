export { pluginReplaceConstantsGlobalThis }

import type { Plugin } from 'vite'
import {
  assert,
  isDebug,
  addVirtualFileIdPrefix,
  isVirtualFileId,
  removeVirtualFileIdPrefix,
  escapeRegex,
} from '../utils.js'

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

// === Two-Plugin Approach
// This file exports two separate Vite plugins:
//
// Plugin 1: Define macros (all environments)
// - Uses Vite's define config to set constants at build time
// - Works reliably for client-side and most server-side scenarios
//
// Plugin 2: Virtual module (server-side only)
// - Provides 'virtual:vike:globalThis-constants' that sets globalThis values
// - Only applies to server environments using applyToEnvironment
// - Automatically loaded to ensure globalThis variables are set reliably in production
// - Solves ssr.external production issues where define macros don't work
//
// Benefits of split approach:
// 1. Optimal performance: define macros for client-side
// 2. Production reliability: virtual module for server-side ssr.external
// 3. Clear separation of concerns
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
const VIRTUAL_MODULE_ID = 'virtual:vike:globalThis-constants'

const filterRolldown = {
  id: {
    include: new RegExp(escapeRegex(VIRTUAL_MODULE_ID)),
  },
}
const filterFunction = (id: string) => id === VIRTUAL_MODULE_ID || id === addVirtualFileIdPrefix(VIRTUAL_MODULE_ID)

function pluginReplaceConstantsGlobalThis(): Plugin[] {
  let isDev: boolean
  return [
    // Plugin 1: Define macros (works for all environments)
    {
      name: 'vike:pluginReplaceConstantsGlobalThis:define',
      config: {
        handler(config) {
          assert(typeof config._isDev === 'boolean')
          isDev = config._isDev
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
    },
    // Plugin 2: Virtual module (server-side only)
    {
      name: 'vike:pluginReplaceConstantsGlobalThis:virtual',
      applyToEnvironment(env) {
        return env.config.consumer === 'server'
      },
      resolveId: {
        filter: filterRolldown,
        handler(id) {
          assert(filterFunction(id))
          assert(id === VIRTUAL_MODULE_ID)
          return addVirtualFileIdPrefix(id)
        },
      },
      load: {
        filter: filterRolldown,
        handler(id, options) {
          assert(filterFunction(id))
          id = removeVirtualFileIdPrefix(id)

          // Generate the virtual module content that sets globalThis values for server-side
          const lines: string[] = []
          lines.push(`globalThis.__VIKE__IS_DEV = ${JSON.stringify(isDev ?? false)};`)
          lines.push(`globalThis.__VIKE__IS_CLIENT = false;`) // Always false on server-side
          lines.push(`globalThis.__VIKE__IS_DEBUG = ${JSON.stringify(isDebug())};`) // Always undefined on server-side
          return lines.join('\n')
        },
      },
    },
  ]
}
