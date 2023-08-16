export { configDefinitionsBuiltIn }
export type { ConfigDefinition }

import type { ConfigEnvPrivate, PageConfigData } from '../../../../../../shared/page-configs/PageConfig.js'
import type { ConfigNameBuiltIn, ConfigNamePrivate } from '../../../../../../shared/page-configs/Config.js'
import { getCodeFilePath } from '../../../../../../shared/page-configs/utils.js'

type ConfigDefinition = {
  env: ConfigEnvPrivate
  effect?: (config: {
    configValue: unknown
    configDefinedAt: string
  }) => undefined | Record<string, Partial<ConfigDefinition>>
  _computed?: (pageConfig: PageConfigData) => unknown
}

type ConfigDefinitionsBuiltIn = Record<ConfigNameBuiltIn | ConfigNamePrivate, ConfigDefinition>
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
    env: '_routing-eager'
  },
  guard: {
    env: '_routing-lazy'
  },
  iKnowThePerformanceRisksOfAsyncRouteFunctions: {
    env: '_routing-eager'
  },
  filesystemRoutingRoot: {
    env: 'config-only'
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
  },
  extends: {
    env: 'config-only'
  },
  meta: {
    env: 'config-only'
  },
  isClientSideRenderable: {
    env: 'server-and-client',
    _computed(pageConfig) {
      const onRenderClientExists: boolean = !!getCodeFilePath(pageConfig, 'onRenderClient')
      const PageExists: boolean =
        !!getCodeFilePath(pageConfig, 'Page') && pageConfig.configElements.Page!.configEnv !== 'server-only'
      return onRenderClientExists && PageExists
    }
  },
  onBeforeRenderEnv: {
    env: 'client-only',
    _computed: (pageConfig) =>
      !getCodeFilePath(pageConfig, 'onBeforeRender') ? null : pageConfig.configElements.onBeforeRender!.configEnv
  }
}
