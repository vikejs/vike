import type { HMRPayload, ModuleNode, ResolvedUrl } from 'vite'
import type { FetchResult } from 'vite/runtime'
import { ConfigVikeResolved } from '../../shared/ConfigVike.js'

export type ClientFunctions = {
  deleteByModuleId(modulePath: string): boolean
  start(options: {
    viteMiddlewareProxyPort: number
    entry: string
    viteConfig: {
      root: string
      configVikePromise: ConfigVikeResolved
    }
  }): void
  invalidateDepTree(ids: string[]): boolean
}

export type ServerFunctions = {
  fetchModule(id: string, importer?: string): Promise<FetchResult>
  moduleGraphResolveUrl(url: string): Promise<ResolvedUrl>
  moduleGraphGetModuleById(id: string): Promise<ModuleNode>
  transformIndexHtml(url: string, html: string, originalUrl?: string): Promise<string>
}
