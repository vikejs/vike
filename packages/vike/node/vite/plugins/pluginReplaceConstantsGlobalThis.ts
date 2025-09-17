export { pluginReplaceConstantsGlobalThis }

import type { Plugin, ResolvedConfig } from 'vite'
import { assert, isDebug, addVirtualFileIdPrefix, escapeRegex } from '../utils.js'
import { isViteServerSide_extraSafe } from '../shared/isViteServerSide.js'
const isDebugVal = isDebug()

declare global {
  /** Like `import.meta.env.DEV` but works inside `node_modules/` (even if package is `ssr.external`). */
  var __VIKE__IS_DEV: boolean
  /** Like `import.meta.env.SSR` but works inside `node_modules/` (even if package is `ssr.external`). */
  var __VIKE__IS_CLIENT: boolean
  var __VIKE__IS_DEBUG: boolean
  var __VIKE__IS_VITE_LOADED: true | undefined
}

globalThis.__VIKE__IS_CLIENT = false
globalThis.__VIKE__IS_DEBUG = isDebugVal
globalThis.__VIKE__IS_VITE_LOADED = true

const VIRTUAL_FILE_ID = 'virtual:vike:globalThis-constants'
const filterRolldown = {
  id: {
    include: new RegExp(escapeRegex(VIRTUAL_FILE_ID)),
  },
}
const filterFunction = (id: string) => id === VIRTUAL_FILE_ID || id === addVirtualFileIdPrefix(VIRTUAL_FILE_ID)

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
                'globalThis.__VIKE__IS_DEBUG': JSON.stringify(isDebugVal),
              }
          return {
            define: {
              'globalThis.__VIKE__IS_CLIENT': JSON.stringify(isClientSide),
              ...defineIsDebug,
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
      applyToEnvironment(env) {
        return env.config.consumer !== 'client'
      },
      resolveId: {
        filter: filterRolldown,
        handler(id) {
          assert(filterFunction(id))
          assert(id === VIRTUAL_FILE_ID)
          return addVirtualFileIdPrefix(id)
        },
      },
      load: {
        filter: filterRolldown,
        handler(id, options) {
          assert(filterFunction(id))
          assert(isViteServerSide_extraSafe(config, this.environment, options))
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
