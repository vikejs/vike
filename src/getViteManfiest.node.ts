import { getGlobal } from './global.node'

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

var viteManifest: ViteManifest
function getViteManifest(): ViteManifest {
  const { root } = getGlobal()
  if (!viteManifest) {
    viteManifest = require(`${root}/dist/client/manifest.json`)
  }
  return viteManifest
}
