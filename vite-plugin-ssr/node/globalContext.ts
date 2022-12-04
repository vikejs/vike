export { getGlobalContext }
export { setGlobalContextViteDevServer }
export { setGlobalContextConfigVps }
export { getViteDevServer }
export type { GlobalContext }

import { PromiseType, assert, assertUsage, objectAssign, getGlobalObject } from './utils'
import type { ViteDevServer } from 'vite'
import { loadBuild } from './plugin/plugins/importBuild/loadBuild'
import { setPageFiles } from '../shared/getPageFiles'
import { assertViteManifest } from './viteManifest'
import { assertPluginManifest } from './plugin/plugins/manifest/assertPluginManifest'
import { getRuntimeConfig, setRuntimeConfig } from './globalContext/runtimeConfig'
import {ConfigVpsResolved} from './plugin/plugins/config/ConfigVps'
const globalObject = getGlobalObject<{ viteDevServer?: ViteDevServer, configVps?: ConfigVpsResolved }>('globalContext.ts', {
})

type GlobalContext = PromiseType<ReturnType<typeof getGlobalContext>>

function setGlobalContextViteDevServer(viteDevServer: ViteDevServer) {
  assert(viteDevServer)
  globalObject.viteDevServer = viteDevServer
}
function getViteDevServer(): ViteDevServer | null {
  return globalObject.viteDevServer ?? null
}
function setGlobalContextConfigVps(configVps: ConfigVpsResolved): void {
  assert(configVps)
  globalObject.configVps = configVps
}

async function getGlobalContext(isPreRendering: boolean) {
  const { viteDevServer, configVps } = globalObject

  const globalContext = {}

  const isProduction = !viteDevServer
  if (isProduction) {
    const buildEntries = await loadBuild()
    assertBuildEntries(buildEntries, isPreRendering)
    const { pageFiles, clientManifest, pluginManifest } = buildEntries
    assertViteManifest(clientManifest)
    assertPluginManifest(pluginManifest)
    setPageFiles(pageFiles)
    objectAssign(globalContext, {
      _isProduction: true as const,
      _manifestClient: clientManifest,
      _manifestPlugin: pluginManifest,
      _configVps: null
    })
    setRuntimeConfig(pluginManifest)
  } else {
    assert(configVps)
    objectAssign(globalContext, {
      _isProduction: false as const,
      _manifestClient: null,
      _manifestPlugin: null,
      _configVps: configVps ?? null
    })
  }

  const runtimeConfig = getRuntimeConfig()
  objectAssign(globalContext, {
    _baseUrl: runtimeConfig.baseUrl, // TODO: remove from pageContext in favor of directly accessing globalContext?
    _baseAssets: runtimeConfig.baseAssets,
    _viteDevServer: viteDevServer ?? null,
    _includeAssetsImportedByServer: runtimeConfig.includeAssetsImportedByServer,
    _objectCreatedByVitePluginSsr: true
  })

  return globalContext
}

function assertBuildEntries<T>(buildEntries: T | null, isPreRendering: boolean): asserts buildEntries is T {
  const errMsg = [
    `You are tyring to run`,
    isPreRendering ? '`$ vite-plugin-ssr prerender`' : 'the server for production',
    "but your app isn't built yet. Run `$ vite build` before ",
    isPreRendering ? 'pre-rendering.' : 'running the server.'
  ].join(' ')
  assertUsage(buildEntries, errMsg)
}
