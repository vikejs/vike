export { defineConfig }

import type { Config } from './Config.js'

function defineConfig<T extends Config>(config: T): T {
  return config
}
