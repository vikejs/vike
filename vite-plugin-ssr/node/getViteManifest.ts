import { getSsrEnv } from './ssrEnv'
import { assert } from './utils'

export { setViteManifest }
export { getViteManifest }
export type { ViteManifest }
export type { ViteManifestEntry }
export type { PluginManifest }

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
  usesClientRouter: boolean
}

var clientManifest: null | ViteManifest = null
var serverManifest: null | ViteManifest = null
var pluginManifest: null | PluginManifest = null
function getViteManifest(): {
  clientManifest: null | ViteManifest
  serverManifest: null | ViteManifest
  pluginManifest: null | PluginManifest
  clientManifestPath: string
  serverManifestPath: string
  pluginManifestPath: string
  outDirPath: string
} {
  const { root, outDir } = getSsrEnv()
  const outDirPath = `${root}/${outDir}`
  const clientManifestPath = `${outDirPath}/client/manifest.json`
  const serverManifestPath = `${outDirPath}/server/manifest.json`
  const pluginManifestPath = `${outDirPath}/client/vite-plugin-ssr.json`

  if (!clientManifest) {
    try {
      clientManifest = require(clientManifestPath)
    } catch (err) {}
  }
  if (!serverManifest) {
    try {
      serverManifest = require(serverManifestPath)
    } catch (err) {}
  }
  if (!pluginManifest) {
    try {
      pluginManifest = require(pluginManifestPath)
    } catch (err) {}
  }

  return {
    clientManifest,
    serverManifest,
    clientManifestPath,
    serverManifestPath,
    pluginManifest,
    pluginManifestPath,
    outDirPath,
  }
}

function setViteManifest(manifests: { clientManifest: unknown; serverManifest: unknown; pluginManifest: unknown }) {
  clientManifest = manifests.clientManifest as ViteManifest
  serverManifest = manifests.serverManifest as ViteManifest
  pluginManifest = manifests.pluginManifest as PluginManifest
  assert(clientManifest && serverManifest && pluginManifest)
}
