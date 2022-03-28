export { manifest }

import { Plugin } from 'vite'
import { assert, normalizePath, projectInfo, isSSR_config } from '../utils'
import { assertPluginManifest } from './manifest/assertPluginManifest'
import { setRuntimeConfig, RuntimeConfig, resolveRuntimeConfig } from '../../globalContext/runtimeConfig'

function manifest(): Plugin[] {
  let ssr: boolean
  let runtimeConfig: RuntimeConfig
  return [
    {
      name: 'vite-plugin-ssr:runtimeConfig',
      apply: 'serve',
      configResolved(config) {
        configResolved(config)
        setRuntimeConfig(runtimeConfig)
      },
    },
    {
      name: 'vite-plugin-ssr:pluginManifest',
      apply: 'build',
      configResolved,
      generateBundle(_, bundle) {
        assert(typeof ssr === 'boolean')
        assert(runtimeConfig)
        if (ssr) return
        const manifest = {
          version: projectInfo.projectVersion,
          usesClientRouter: includesClientSideRouter(bundle as any),
          ...runtimeConfig,
        }
        assertPluginManifest(manifest)
        this.emitFile({
          fileName: `vite-plugin-ssr.json`,
          type: 'asset',
          source: JSON.stringify(manifest, null, 2),
        })
      },
    },
  ] as Plugin[]

  function configResolved(config: Parameters<NonNullable<Plugin['configResolved']>>[0]) {
    ssr = isSSR_config(config)
    runtimeConfig = resolveRuntimeConfig(config)
  }
}

function includesClientSideRouter(bundle: Record<string, { modules?: Record<string, unknown> }>) {
  // Current directory: vite-plugin-ssr/dist/cjs/node/plugin/plugins/
  const filePath = require.resolve('../../../../../dist/esm/client/router/useClientRouter.js')
  for (const file of Object.keys(bundle)) {
    const bundleFile = bundle[file]
    assert(bundleFile)
    const modules = bundleFile.modules || {}
    if (filePath in modules || normalizePath(filePath) in modules) {
      return true
    }
  }
  return false
}
