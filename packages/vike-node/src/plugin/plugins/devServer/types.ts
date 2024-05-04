export type { ClientFunctions, MinimalModuleNode, ServerFunctions, WorkerData }

import type { EnvironmentModuleNode, ResolvedUrl } from 'vite'

type WorkerData = {
  entry: string
  viteConfig: {
    root: string
    configVikePromise: any
  }
}

type ClientFunctions = {
  start(workerData: WorkerData): void
  onViteTransportMessage(data: any): void
  onHmrReceive: (data: any) => void
}

type MinimalModuleNode = Pick<EnvironmentModuleNode, 'id' | 'url' | 'type'> & {
  importedModules: Set<MinimalModuleNode>
}

type ServerFunctions = {
  moduleGraphResolveUrl(url: string): Promise<ResolvedUrl>
  moduleGraphGetModuleById(id: string): MinimalModuleNode | undefined
  transformIndexHtml(url: string, html: string, originalUrl?: string): Promise<string>
  onViteTransportMessage(data: any): void
}
