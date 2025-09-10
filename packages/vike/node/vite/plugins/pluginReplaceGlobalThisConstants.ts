export { pluginReplaceGlobalThisConstants }

import type { Plugin } from 'vite'
import { assert } from '../utils.js'

declare global {
  /** `undefined` means we don't know: if the module isn't processed by Vite then the information isn't available */
  var __VIKE__IS_DEV: boolean | undefined
  /** `undefined` means `false`: if the module isn't processed by Vite then the module cannot be client-side */
  var __VIKE__IS_CLIENT: boolean | undefined
}

function pluginReplaceGlobalThisConstants(): Plugin[] {
  return [
    {
      name: 'vike:pluginReplaceGlobalThisConstants',
      config: {
        handler(config) {
          const isDev = config._isDev
          assert(typeof isDev === 'boolean')
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
