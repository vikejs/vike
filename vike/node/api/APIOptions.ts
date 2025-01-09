export { APIOptions }

import type { InlineConfig } from 'vite'

type APIOptions = {
  /**
   * Vite config.
   *
   * https://vike.dev/api
   */
  viteConfig?: InlineConfig
}
