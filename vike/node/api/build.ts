export { build }

import assert from 'assert'
import { build as buildVite, createBuilder } from 'vite'
import { isVikeCli } from '../cli/context.js'
import { isPrerendering } from '../prerender/context.js'
import { prepareViteApiCall } from './prepareViteApiCall.js'
import type { APIOptions } from './types.js'

/**
 * Programmatically trigger `$ vike build`
 *
 * https://vike.dev/api#build
 */
async function build(options: APIOptions = {}): Promise<{}> {
  const { viteConfigEnhanced, vikeConfig } = await prepareViteApiCall(options.viteConfig, 'build')

  // Pass it to autoFullBuild()
  if (viteConfigEnhanced) viteConfigEnhanced._viteConfigEnhanced = viteConfigEnhanced

  // 1. Build client-side
  // 2. Build server-side
  //    > See: https://github.com/vikejs/vike/blob/c6c7533a56b3a16fc43ed644fc5c10c02d0ff375/vike/node/plugin/plugins/autoFullBuild.ts#L90
  // 3. Pre-render (if enabled)
  //    > See: https://github.com/vikejs/vike/blob/c6c7533a56b3a16fc43ed644fc5c10c02d0ff375/vike/node/plugin/plugins/autoFullBuild.ts#L98
  //    > We purposely don't start the pre-rendering in this `build()` function but in a Rollup hook instead.
  //    > Rationale: https://github.com/vikejs/vike/issues/2123
  if (vikeConfig.global.config.viteEnvironmentAPI) {
    const builder = await createBuilder(viteConfigEnhanced)
    await builder.buildApp()
  } else {
    await buildVite(viteConfigEnhanced)

    // When using the Vike CLI with pre-rendering the process is forcefully exited at the end of the buildVite() call above
    assert(!(isVikeCli() && isPrerendering()))
  }

  return {
    /* We don't return `viteConfig` because `viteConfigEnhanced` is `InlineConfig` not `ResolvedConfig`
    viteConfig: viteConfigEnhanced,
    */
  }
}
