export type { ApiOptions }
export type { Operation }

import type { InlineConfig } from 'vite'
import type { Config } from '../../types/Config.js'

type ApiOptions = {
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
