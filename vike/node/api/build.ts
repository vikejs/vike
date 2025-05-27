export { build }

import { prepareViteApiCall } from './prepareViteApiCall.js'
import { build as buildVite, version, createBuilder } from 'vite'
import type { APIOptions } from './types.js'
import { isVikeCli } from '../cli/context.js'
import { isPrerendering } from '../prerender/context.js'
import { assert, assertVersion } from './utils.js'

/**
 * Programmatically trigger `$ vike build`
 *
 * https://vike.dev/api#build
 */
async function build(options: APIOptions = {}): Promise<{}> {
  const { viteConfigFromUserEnhanced, vikeConfig } = await prepareViteApiCall(options, 'build')

  // Pass it to pluginAutoFullBuild()
  if (viteConfigFromUserEnhanced) viteConfigFromUserEnhanced._viteConfigFromUserEnhanced = viteConfigFromUserEnhanced

  if (vikeConfig.global.config.vite6BuilderApp) {
    // This assertion isn't reliable: the user may still use a Vite version older than 6.0.0 — see https://github.com/vitejs/vite/pull/19355
    assertVersion('Vite', version, '6.0.0')
    const builder = await createBuilder(viteConfigFromUserEnhanced)
    // See Vite plugin vike:build:pluginBuildApp
    await builder.buildApp()
  } else {
    // This buildVite() call does everything:
    // 1. Build client-side
    // 2. Build server-side
    //    > See: https://github.com/vikejs/vike/blob/c6c7533a56b3a16fc43ed644fc5c10c02d0ff375/vike/node/plugin/plugins/autoFullBuild.ts#L90
    // 3. Pre-render (if enabled)
    //    > See: https://github.com/vikejs/vike/blob/c6c7533a56b3a16fc43ed644fc5c10c02d0ff375/vike/node/plugin/plugins/autoFullBuild.ts#L98
    //    > We purposely don't start the pre-rendering in this `build()` function but in a Rollup hook instead.
    //    > Rationale: https://github.com/vikejs/vike/issues/2123
    await buildVite(viteConfigFromUserEnhanced)
    // After pre-rendering, when using the Vike CLI, the process is forcefully exited at the end of the buildVite() call above.
    if (isVikeCli() && isPrerendering()) assert(false)
  }

  return {
    /* We don't return `viteConfig` because `viteConfigFromUserEnhanced` is `InlineConfig` not `ResolvedConfig`
    viteConfig: viteConfigFromUserEnhanced,
    */
  }
}
