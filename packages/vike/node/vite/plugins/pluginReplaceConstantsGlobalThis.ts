export { pluginReplaceConstantsGlobalThis }
export { VIRTUAL_FILE_ID_globalThisConstants }
// Trick for loading the `declare global` below
export type _LoadDeclareGlobal__VIKE__IS = never

import type { Plugin, ResolvedConfig } from 'vite'
import { assert, isDebug, addVirtualFileIdPrefix, escapeRegex } from '../utils.js'
import {
  isViteServerSide_applyToEnvironment,
  isViteServerSide_configEnvironment,
  isViteServerSide_extraSafe,
} from '../shared/isViteServerSide.js'

declare global {
  /** Like `import.meta.env.DEV` but works for `node_modules/` packages with `ssr.external` */
  var __VIKE__IS_DEV: boolean
  /** Like `import.meta.env.SSR` but works for `node_modules/` packages with `ssr.external` */
  var __VIKE__IS_CLIENT: boolean
  var __VIKE__IS_DEBUG: boolean
}

const isDebugVal = isDebug()
globalThis.__VIKE__IS_CLIENT = false
globalThis.__VIKE__IS_DEBUG = isDebugVal

const VIRTUAL_FILE_ID_globalThisConstants = 'virtual:vike:server:globalThisConstants'
const filterRolldown = {
  id: {
    include: new RegExp(escapeRegex(VIRTUAL_FILE_ID_globalThisConstants)),
  },
}
const filterFunction = (id: string) => id === VIRTUAL_FILE_ID_globalThisConstants || id === addVirtualFileIdPrefix(VIRTUAL_FILE_ID_globalThisConstants)

function pluginReplaceConstantsGlobalThis(): Plugin[] {
  let config: ResolvedConfig
  let isDev: boolean
  return [
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
              'globalThis.__VIKE__IS_DEBUG': JSON.stringify(isDebugVal),
            },
          }
        },
      },
      configEnvironment: {
        handler(name, config) {
          const isClientSide = !isViteServerSide_configEnvironment(name, config)
          return {
            define: {
              'globalThis.__VIKE__IS_CLIENT': JSON.stringify(isClientSide),
            },
          }
        },
      },
      configResolved(config_) {
        config = config_
      },
    },
    {
      name: 'vike:pluginReplaceConstantsGlobalThis:virtual-file',
      // We only need the virtual file for the server-side (for node_modules/ packages with ssr.external) — the `define` values above always apply to the client-side.
      applyToEnvironment(env) {
        return isViteServerSide_applyToEnvironment(env)
      },
      resolveId: {
        filter: filterRolldown,
        handler(id) {
          assert(filterFunction(id))
          assert(id === VIRTUAL_FILE_ID_globalThisConstants)
          return addVirtualFileIdPrefix(id)
        },
      },
      load: {
        filter: filterRolldown,
        handler(id, options) {
          assert(filterFunction(id))
          assert(isViteServerSide_extraSafe(config, this.environment, options))
          assert(typeof isDev === 'boolean')
          const code = [
            `globalThis.__VIKE__IS_DEV = ${JSON.stringify(isDev)};`,
            `globalThis.__VIKE__IS_CLIENT = false;`,
            `globalThis.__VIKE__IS_DEBUG = ${JSON.stringify(isDebugVal)};`,
          ].join('\n')
          return code
        },
      },
    },
  ]
}
