export { configDefinitionsBuiltIn }
export type { ConfigDefinition }

import type { ConfigName, ConfigEnv } from '../../../../../../shared/page-configs/PageConfig'

type ConfigDefinition = {
  env: ConfigEnv
  effect?: (config: {
    configValue: unknown
    configDefinedAt: string
  }) => undefined | Record<string, Partial<ConfigDefinition>>
}

type ConfigDefinitionsBuiltIn = Record<ConfigName, ConfigDefinition>
const configDefinitionsBuiltIn: ConfigDefinitionsBuiltIn = {
  onRenderHtml: {
    env: 'server-only'
  },
  onRenderClient: {
    env: 'client-only'
  },
  onHydrationEnd: {
    env: 'client-only'
  },
  onPageTransitionStart: {
    env: 'client-only'
  },
  onPageTransitionEnd: {
    env: 'client-only'
  },
  onBeforeRender: {
    env: 'server-only'
  },
  onBeforePrerenderStart: {
    env: 'server-only'
  },
  Page: {
    env: 'server-and-client'
  },
  passToClient: {
    env: 'server-only'
  },
  route: {
    env: '_routing-env'
  },
  iKnowThePerformanceRisksOfAsyncRouteFunctions: {
    env: '_routing-env'
  },
  filesystemRoutingRoot: {
    env: '_routing-env'
  },
  client: {
    env: 'client-only'
  },
  clientRouting: {
    env: 'server-and-client' // TODO: config-only instead?
  },
  prerender: {
    env: 'config-only'
  },
  hydrationCanBeAborted: {
    env: 'client-only' // TODO: config-only instead?
  },
  prefetchStaticAssets: {
    env: 'client-only' // TODO: config-only instead?
  }
}
