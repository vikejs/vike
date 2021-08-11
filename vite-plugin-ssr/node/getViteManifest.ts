import { getSsrEnv } from './ssrEnv'
import { assert } from '../shared/utils'

export { setViteManifest }
export { getViteManifest }
export { ViteManifest }

type ViteManifest = Record<
  string,
  {
    src?: string
    file: string
    css?: string[]
    assets?: string[]
    isEntry?: boolean
    isDynamicEntry?: boolean
    imports?: string[]
    dynamicImports?: string[]
  }
>

var clientManifest: null | ViteManifest = null
var serverManifest: null | ViteManifest = null
function getViteManifest(): {
  clientManifest: null | ViteManifest
  serverManifest: null | ViteManifest
  clientManifestPath: string
  serverManifestPath: string
} {
  const { root } = getSsrEnv()
  const clientManifestPath = `${root}/dist/client/manifest.json`
  const serverManifestPath = `${root}/dist/server/manifest.json`

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

  return {
    clientManifest,
    serverManifest,
    clientManifestPath,
    serverManifestPath
  }
}

function setViteManifest(manifests: { clientManifest: unknown; serverManifest: unknown }) {
  clientManifest = manifests.clientManifest as ViteManifest
  serverManifest = manifests.serverManifest as ViteManifest
  assert(clientManifest && serverManifest)
}
