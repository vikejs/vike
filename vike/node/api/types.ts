export type { APIOptions }
export type { Operation }

import type { InlineConfig } from 'vite'

type APIOptions = {
  /**
   * Vite config.
   *
   * https://vike.dev/api
   */
  viteConfig?: InlineConfig
}

type Operation = Operation
