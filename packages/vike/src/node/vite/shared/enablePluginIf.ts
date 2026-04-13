export { enablePluginIf }
export type { EnableCondition }

import type { ConfigEnv, ConfigPluginContext, UserConfig, Plugin } from 'vite'
import '../assertEnvVite.js'

/**
 * Enables a plugin based on a specified condition callback which will be executed during the `config` hook.
 */
function enablePluginIf(condition: EnableCondition, originalPlugin: Plugin): Plugin {
  const originalConfig = originalPlugin.config

  originalPlugin.config = {
    order: originalConfig && 'order' in originalConfig ? originalConfig.order : 'pre',
    async handler(c, e) {
      const enabled = await condition.call(this, c, e)
      if (!enabled) {
        const keysToDelete = Object.keys(originalPlugin).filter((k) => k !== 'name')
        originalPlugin.name += ':disabled'
        for (const key of keysToDelete) {
          // @ts-expect-error
          delete originalPlugin[key]
        }
      } else if (originalConfig) {
        if (typeof originalConfig === 'function') {
          return originalConfig.call(this, c, e)
        }
        return originalConfig.handler.call(this, c, e)
      }
    },
  }

  return originalPlugin
}

type EnableCondition = (this: ConfigPluginContext, config: UserConfig, env: ConfigEnv) => boolean | Promise<boolean>
