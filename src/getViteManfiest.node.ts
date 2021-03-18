import { getSsrEnv } from './ssrEnv.node'
import { assert, assertUsage } from './utils'

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

var clientManifest: ViteManifest
var serverManifest: ViteManifest
function getViteManifest() {
  const { root, isProduction } = getSsrEnv()
  assert(isProduction)
  if (!clientManifest || !serverManifest) {
    const errMsg =
      "You are trying to run the server with `isProduction: true` but you didn't build your app yet. Make sure to run `vite build && vite build --ssr`. (The build manifest is missing at"
    const clientManifestPath = `${root}/dist/client/manifest.json`
    const serverManifestPath = `${root}/dist/server/manifest.json`
    try {
      clientManifest = require(clientManifestPath)
    } catch (err) {
      assertUsage(false, `${errMsg} \`${clientManifestPath}\`.`)
    }
    try {
      serverManifest = require(serverManifestPath)
    } catch (err) {
      assertUsage(false, `${errMsg} \`${serverManifestPath}\`.`)
    }
    assert(clientManifest)
    assert(serverManifest)
  }
  return { clientManifest, serverManifest }
}
