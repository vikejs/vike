export type { ApiOptions }
export type { ApiOperation }

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

type ApiOperation = 'build' | 'dev' | 'preview' | 'prerender'
