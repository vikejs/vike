export type { APIOptions }
export type { Command }

import type { InlineConfig } from 'vite'

type APIOptions = {
  /**
   * Vite config.
   *
   * https://vike.dev/api
   */
  viteConfig?: InlineConfig
}

type Command = 'build' | 'dev' | 'preview' | 'prerender'
