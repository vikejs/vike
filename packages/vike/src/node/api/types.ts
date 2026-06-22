export type { ApiOptions }
export type { ApiOptionsStartupLog }
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

type ApiOptionsStartupLog = {
  /**
   * Whether to print Vike's startup log.
   *
   * https://vike.dev/api
   */
  startupLog?: boolean
}

type ApiOperation = 'build' | 'dev' | 'preview' | 'prerender'
