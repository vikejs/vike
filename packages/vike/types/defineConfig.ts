export { defineConfig }

import type { Config } from './Config.js'

// For JavaScript users. AFAICT there isn't another practical reason to use defineConfig() instead of `Config`.
// https://github.com/vikejs/vike/issues/1156
function defineConfig<T extends Config>(config: T): T {
  return config
}
