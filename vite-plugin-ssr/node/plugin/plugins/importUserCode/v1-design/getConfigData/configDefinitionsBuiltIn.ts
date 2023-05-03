export { configDefinitionsBuiltIn }
export type { ConfigDefinition }

import type { ConfigName, ConfigEnv } from '../../../../../../shared/page-configs/PageConfig'

type ConfigDefinition = {
  env: ConfigEnv
  c_global?: boolean // TODO: implement or remove
  c_code?: true // TODO: remove
  effect?: (config: {
    configValue: unknown
    configDefinedAt: string
  }) => undefined | Record<string, Partial<ConfigDefinition>>
}

type ConfigDefinitionsBuiltIn = Record<ConfigName, ConfigDefinition>
const configDefinitionsBuiltIn: ConfigDefinitionsBuiltIn = {
  onRenderHtml: {
    c_code: true,
    env: 'server-only'
  },
  onRenderClient: {
    c_code: true,
    env: 'client-only'
  },
  onHydrationEnd: {
    c_code: true,
    env: 'client-only'
  },
  onPageTransitionStart: {
    c_code: true,
    env: 'client-only'
  },
  onPageTransitionEnd: {
    c_code: true,
    env: 'client-only'
  },
  onBeforeRender: {
    c_code: true,
    env: 'server-only'
  },
  onBeforePrerenderStart: {
    c_code: true,
    env: 'server-only'
  },
  Page: {
    c_code: true,
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
    c_code: true,
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
