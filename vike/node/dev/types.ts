export type { ClientFunctions, MinimalModuleNode, ServerFunctions }

import type { ModuleNode, ResolvedUrl } from 'vite'
import type { FetchResult } from 'vite/runtime'
import type { ConfigVikeResolved } from '../../shared/ConfigVike.js'

type ClientFunctions = {
  deleteByModuleId(modulePath: string): boolean
  start(options: {
    viteMiddlewareProxyPort: number
    entry: string
    viteConfig: {
      root: string
      configVikePromise: ConfigVikeResolved
    }
  }): Promise<void>
  invalidateDepTree(ids: string[]): boolean
}

type MinimalModuleNode = Pick<ModuleNode, 'id' | 'url' | 'type'> & { importedModules: Set<MinimalModuleNode> }

type ServerFunctions = {
  fetchModule(id: string, importer?: string): Promise<FetchResult>
  moduleGraphResolveUrl(url: string): Promise<ResolvedUrl>
  moduleGraphGetModuleById(id: string): MinimalModuleNode | undefined
  transformIndexHtml(url: string, html: string, originalUrl?: string): Promise<string>
}
