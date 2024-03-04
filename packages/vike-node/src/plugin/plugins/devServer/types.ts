export type { ClientFunctions, MinimalModuleNode, ServerFunctions, WorkerData }

import type { ModuleNode, ResolvedUrl } from 'vite'
import type { FetchResult } from 'vite/runtime'

type WorkerData = {
  entry: string
  viteConfig: {
    root: string
    configVikePromise: any
  }
}

type ClientFunctions = {
  start(workerData: WorkerData): void
  deleteByModuleId(modulePath: string): boolean
  invalidateDepTree(ids: string[]): boolean
}

type MinimalModuleNode = Pick<ModuleNode, 'id' | 'url' | 'type'> & { importedModules: Set<MinimalModuleNode> }

type ServerFunctions = {
  fetchModule(id: string, importer?: string): Promise<FetchResult>
  moduleGraphResolveUrl(url: string): Promise<ResolvedUrl>
  moduleGraphGetModuleById(id: string): MinimalModuleNode | undefined
  transformIndexHtml(url: string, html: string, originalUrl?: string): Promise<string>
}
