export { setViteManifest }
export { getViteManifest }
export type { ViteManifest }
export type { ViteManifestEntry }
export type { PluginManifest }

import { assert, assertUsage, isPlainObject, projectInfo } from './utils'

type ViteManifestEntry = {
  src?: string
  file: string
  css?: string[]
  assets?: string[]
  isEntry?: boolean
  isDynamicEntry?: boolean
  imports?: string[]
  dynamicImports?: string[]
}
type ViteManifest = Record<string, ViteManifestEntry>

type PluginManifest = {
  version: string
  base: string
  baseAssets: string
  usesClientRouter: boolean
}

let manifests: null | {
  clientManifest: ViteManifest
  serverManifest: ViteManifest
  pluginManifest: PluginManifest
} = null
function getViteManifest(isPreRendering: boolean): {
  clientManifest: ViteManifest
  serverManifest: ViteManifest
  pluginManifest: PluginManifest
} {
  if (isPreRendering) {
    assertUsage(
      manifests,
      "You are tyring to run `$ vite-plugin-ssr prerender` but your app isn't built yet. Make to sure to run `$ vite build && vite build --ssr` before pre-rendering.",
    )
  }
  assert(manifests)
  return manifests
}

function setViteManifest(manifests_: { clientManifest: unknown; serverManifest: unknown; pluginManifest: unknown }) {
  assert(manifests_)
  assertPluginManifest(manifests_.pluginManifest)
  manifests = manifests_ as any
  assert(manifests)
  assert(manifests.clientManifest && manifests.serverManifest && manifests.pluginManifest)
}

function assertPluginManifest(pluginManifest: unknown) {
  assert(isPlainObject(pluginManifest))
  assert(typeof pluginManifest.base === 'string')
  assert(pluginManifest.base.startsWith('/'))
  assert(typeof pluginManifest.usesClientRouter === 'boolean')
  assert(typeof pluginManifest.version === 'string')
  assert(pluginManifest.baseAssets === null || typeof pluginManifest.baseAssets === 'string')
  assertUsage(
    pluginManifest.version === projectInfo.projectVersion,
    `Re-build your app \`$ vite build && vite build --ssr && vite-plugin-ssr prerender\`. (You are using \`vite-plugin-ssr@${projectInfo.projectVersion}\` but your build has been generated with following different version \`vite-plugin-ssr@${pluginManifest.version}\`.)`,
  )
}
