export { build }

import { prepareViteApiCall } from './prepareViteApiCall.js'
import { createBuilder } from 'vite'
import type { ApiOptions } from './types.js'
import './assertEnvApiDev.js'

/**
 * Programmatically trigger `$ vike build`
 *
 * https://vike.dev/api#build
 */
async function build(options: ApiOptions = {}): Promise<{}> {
  const { viteConfigFromUserResolved } = await prepareViteApiCall(options, 'build')

  // Pass it to vike:build:pluginBuildApp
  if (viteConfigFromUserResolved) viteConfigFromUserResolved._viteConfigFromUserResolved = viteConfigFromUserResolved

  const builder = await createBuilder(viteConfigFromUserResolved)
  // buildApp() is implemented by vike:build:pluginBuildApp
  await builder.buildApp()

  return {
    /* We don't return `viteConfig` because `viteConfigFromUserResolved` is `InlineConfig` not `ResolvedConfig`
    viteConfig: viteConfigFromUserResolved,
    */
  }
}
