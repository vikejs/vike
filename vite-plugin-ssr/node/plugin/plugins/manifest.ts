export { manifest }

import { Plugin, ResolvedConfig } from 'vite'
import { assert, projectInfo, isSSR_config, apply } from '../utils'
import { assertPluginManifest } from './manifest/assertPluginManifest'
import { setRuntimeConfig, RuntimeConfig, resolveRuntimeConfig } from '../../globalContext/runtimeConfig'
import { isUsingClientRouter } from './extractExportNamesPlugin'
import { assertConfigVpsResolved } from './config/assertConfigVps'

function manifest(): Plugin[] {
  let ssr: boolean
  let runtimeConfig: RuntimeConfig
  return [
    {
      name: 'vite-plugin-ssr:runtimeConfig',
      apply: apply('dev'),
      configResolved(config) {
        configResolved(config)
        setRuntimeConfig(runtimeConfig)
      },
    },
    {
      name: 'vite-plugin-ssr:pluginManifest',
      apply: 'build',
      configResolved,
      generateBundle() {
        assert(typeof ssr === 'boolean')
        assert(runtimeConfig)
        if (ssr) return
        const manifest = {
          version: projectInfo.projectVersion,
          usesClientRouter: isUsingClientRouter(),
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

  function configResolved(config: ResolvedConfig) {
    assertConfigVpsResolved(config)
    ssr = isSSR_config(config)
    runtimeConfig = resolveRuntimeConfig(config)
  }
}
