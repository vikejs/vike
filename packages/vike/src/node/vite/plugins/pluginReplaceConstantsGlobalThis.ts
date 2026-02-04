import '../assertEnvVite.js'

export { pluginReplaceConstantsGlobalThis }
export { VIRTUAL_FILE_ID_constantsGlobalThis }
// Trick for loading the `declare global` below
export type _LoadDeclareGlobal__VIKE__IS = never

import type { Plugin, ResolvedConfig } from 'vite'
import { isDebug } from '../../../utils/debug.js'
import { escapeRegex } from '../../../utils/escapeRegex.js'
import { addVirtualFileIdPrefix } from '../../../utils/virtualFileId.js'
import { assert } from '../../../utils/assert.js'
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
  /** Whether the code is processed by Vite, i.e. `true` when the code is `ssr.noExternal` */
  var __VIKE__IS_NOT_EXTERNAL: true | undefined
}

const VIRTUAL_FILE_ID_constantsGlobalThis = 'virtual:vike:server:constantsGlobalThis'

const isDebugVal = isDebug()
globalThis.__VIKE__IS_CLIENT = false
globalThis.__VIKE__IS_DEBUG = isDebugVal

// === Rolldown filter
const filterRolldown = {
  id: {
    include: new RegExp(escapeRegex(VIRTUAL_FILE_ID_constantsGlobalThis)),
  },
}
const filterFunction = (id: string) =>
  id === VIRTUAL_FILE_ID_constantsGlobalThis || id === addVirtualFileIdPrefix(VIRTUAL_FILE_ID_constantsGlobalThis)
// ===

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
              'globalThis.__VIKE__IS_NOT_EXTERNAL': 'true',
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
          assert(id === VIRTUAL_FILE_ID_constantsGlobalThis)
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
