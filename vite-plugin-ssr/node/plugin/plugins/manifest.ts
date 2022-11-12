export { manifest }

import { Plugin, ResolvedConfig } from 'vite'
import { assert, projectInfo, viteIsSSR } from '../utils'
import { apply } from '../helpers'
import { assertPluginManifest } from './manifest/assertPluginManifest'
import { setRuntimeConfig, RuntimeConfig, resolveRuntimeConfig } from '../../globalContext/runtimeConfig'
import { isUsingClientRouter } from './extractExportNamesPlugin'
import { getConfigVps } from './config/assertConfigVps'

function manifest(): Plugin[] {
  let ssr: boolean
  let runtimeConfig: RuntimeConfig
  return [
    {
      name: 'vite-plugin-ssr:runtimeConfig',
      apply: apply('dev'),
      async configResolved(config) {
        await onConfigResolved(config)
        setRuntimeConfig(runtimeConfig)
      }
    },
    {
      name: 'vite-plugin-ssr:pluginManifest',
      apply: 'build',
      configResolved: onConfigResolved,
      generateBundle() {
        assert(typeof ssr === 'boolean')
        assert(runtimeConfig)
        if (ssr) return
        const manifest = {
          version: projectInfo.projectVersion,
          usesClientRouter: isUsingClientRouter(),
          ...runtimeConfig
        }
        assertPluginManifest(manifest)
        this.emitFile({
          fileName: `vite-plugin-ssr.json`,
          type: 'asset',
          source: JSON.stringify(manifest, null, 2)
        })
      }
    }
  ] as Plugin[]

  async function onConfigResolved(config: ResolvedConfig) {
    const configVps = await getConfigVps(config)
    ssr = viteIsSSR(config)
    runtimeConfig = resolveRuntimeConfig(config, configVps)
  }
}
