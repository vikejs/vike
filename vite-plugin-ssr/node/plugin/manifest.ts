import { Plugin } from 'vite'
import { assert, normalizePath, projectInfo } from '../../shared/utils'

export { manifest }

type Config = {
  base: string
  build?: {
    ssr?: boolean | string
  }
}

type Bundle = Record<string, { modules?: Record<string, unknown> }>

function manifest() {
  let base: string
  let ssr: boolean
  return {
    name: 'vite-plugin-ssr:manifest',
    apply: 'build',
    configResolved(config: Config) {
      base = config.base
      ssr = isSSR(config)
    },
    generateBundle(_: never, bundle: Bundle) {
      if (ssr) return
      assert(typeof base === 'string')
      assert(typeof ssr === 'boolean')
      const manifest = {
        version: projectInfo.version,
        doesClientSideRouting: includesClientSideRouter(bundle),
        base
      }
      this.emitFile({
        fileName: `vite-plugin-ssr.json`,
        type: 'asset',
        source: JSON.stringify(manifest, null, 2)
      })
    }
  }
}

function includesClientSideRouter(bundle: Bundle) {
  const filePath = require.resolve('../../../../dist/esm/client/router/getPageContext.js')
  for (const file of Object.keys(bundle)) {
    const bundleFile = bundle[file]
    const modules = bundleFile.modules || {}
    if (filePath in modules || normalizePath(filePath) in modules) {
      return true
    }
  }
  return false
}

function isSSR(config: { build?: { ssr?: boolean | string } }): boolean {
  return !!config?.build?.ssr
}
