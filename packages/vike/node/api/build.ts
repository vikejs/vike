export { build }

import { prepareViteApiCall } from './prepareViteApiCall.js'
import { createBuilder } from 'vite'
import type { APIOptions } from './types.js'

/**
 * Programmatically trigger `$ vike build`
 *
 * https://vike.dev/api#build
 */
async function build(options: APIOptions = {}): Promise<{}> {
  const { viteConfigFromUserEnhanced } = await prepareViteApiCall(options, 'build')

  // Pass it to pluginAutoFullBuild()
  if (viteConfigFromUserEnhanced) viteConfigFromUserEnhanced._viteConfigFromUserEnhanced = viteConfigFromUserEnhanced

  const builder = await createBuilder(viteConfigFromUserEnhanced)
  // buildApp() is implemented by vike:build:pluginBuildApp
  await builder.buildApp()

  return {
    /* We don't return `viteConfig` because `viteConfigFromUserEnhanced` is `InlineConfig` not `ResolvedConfig`
    viteConfig: viteConfigFromUserEnhanced,
    */
  }
}
