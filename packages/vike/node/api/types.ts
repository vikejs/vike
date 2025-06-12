export type { APIOptions }
export type { Operation }

import type { InlineConfig } from 'vite'
import type { Config } from '../../types/Config.js'

type APIOptions = {
  /**
   * Vite config.
   *
   * https://vike.dev/api
   */
  viteConfig?: InlineConfig
  /**
   * Vike config.
   *
   * https://vike.dev/api
   */
  vikeConfig?: Config
}

type Operation = 'build' | 'dev' | 'preview' | 'prerender'
