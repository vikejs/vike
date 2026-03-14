export { runPrerenderFromAPI }
export { runPrerenderFromCLIPrerenderCommand }
export { runPrerenderFromAutoRun }
export { runPrerender_forceExit }

import { assert } from '../../utils/assert.js'
import type { InlineConfig, ResolvedConfig } from 'vite'
import { prepareViteApiCall } from '../api/prepareViteApiCall.js'
import { isVikeCli } from '../cli/context.js'
import { isViteCli } from '../vite/shared/isViteCli.js'
import { PrerenderOptions, runPrerender } from './runPrerender.js'
import { logErrorServer } from '../../server/runtime/logErrorServer.js'
import { getGlobalContextServerInternal } from '../../server/runtime/globalContext.js'

async function runPrerenderFromAPI(options: PrerenderOptions = {}): Promise<{ viteConfig: null | ResolvedConfig }> {
  // - We purposely propagate the error to the user land, so that the error interrupts the user land. It's also, I guess, a nice-to-have that the user has control over the error.
  // - We don't use addErrorHint() because we don't have control over what happens with the error. For example, if the user land purposely swallows the error then the hint shouldn't be logged. Also, it's best if the hint is shown to the user *after* the error, but we cannot do/guarentee that.
  await runPrerender(options, 'prerender()')
  const { globalContext } = await getGlobalContextServerInternal()
  const viteConfig = globalContext.viteConfig ?? null
  return { viteConfig }
}
async function runPrerenderFromCLIPrerenderCommand(): Promise<void> {
  try {
    const { viteConfigFromUserResolved } = await prepareViteApiCall({}, 'prerender')
    await runPrerender({ viteConfig: viteConfigFromUserResolved }, '$ vike prerender')
  } catch (err) {
    // Error may come from user-land
    logErrorServer(err, null)
    process.exit(1)
  }
  runPrerender_forceExit()
  assert(false)
}
async function runPrerenderFromAutoRun(viteConfig: InlineConfig | undefined): Promise<{ forceExit: boolean }> {
  try {
    await runPrerender({ viteConfig }, 'auto-run')
  } catch (err) {
    // Avoid Rollup prefixing the error with [vike:build:pluginBuildApp], see for example https://github.com/vikejs/vike/issues/472#issuecomment-1276274203
    logErrorServer(err, null)
    process.exit(1)
  }
  const forceExit = isVikeCli() || isViteCli()
  return { forceExit }
}

function runPrerender_forceExit() {
  // Force exit; known situations where pre-rendering is hanging:
  //  - https://github.com/vikejs/vike/discussions/774#discussioncomment-5584551
  //  - https://github.com/vikejs/vike/issues/807#issuecomment-1519010902
  process.exit(0)

  /* I guess there is no need to tell the user about it? Let's see if a user complains.
   * I don't known whether there is a way to call process.exit(0) only if needed, thus I'm not sure if there is a way to conditionally show a assertInfo().
  assertInfo(false, "Pre-rendering was forced exit. (Didn't gracefully exit because the event queue isn't empty. This is usually fine, see ...", { onlyOnce: false })
  */
}
