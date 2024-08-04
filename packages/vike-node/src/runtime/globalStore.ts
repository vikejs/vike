import type { IncomingMessage, ServerResponse } from 'http'
import type { ViteDevServer } from 'vite'
import { NextFunction } from './types.js'

// @ts-expect-error
export const globalStore = (globalThis.__vikeNode ||= {
  isPluginLoaded: false,
  // This is overridden in devServerPlugin
  HMRProxy: (req: IncomingMessage, res: ServerResponse, next?: NextFunction) => {
    next?.()
    return false
  }
}) as {
  isPluginLoaded: boolean
  viteDevServer?: ViteDevServer
  HMRProxy: (req: IncomingMessage, res: ServerResponse, next?: NextFunction) => boolean
}
