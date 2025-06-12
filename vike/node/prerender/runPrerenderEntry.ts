export { runPrerenderFromAPI }
export { runPrerenderFromCLIPrerenderCommand }
export { runPrerenderFromAutoRun }
export { runPrerender_forceExit }

import { assert } from './utils.js'
import type { InlineConfig, ResolvedConfig } from 'vite'
import { logErrorHint } from '../runtime/renderPage/logErrorHint.js'
import { prepareViteApiCall } from '../api/prepareViteApiCall.js'
import { isVikeCli } from '../cli/context.js'
import { isViteCliCall } from '../vite/shared/isViteCliCall.js'
import { PrerenderOptions, runPrerender } from './runPrerender.js'

async function runPrerenderFromAPI(options: PrerenderOptions = {}): Promise<{ viteConfig: ResolvedConfig }> {
  // - We purposely propagate the error to the user land, so that the error interrupts the user land. It's also, I guess, a nice-to-have that the user has control over the error.
  // - We don't use logErrorHint() because we don't have control over what happens with the error. For example, if the user land purposely swallows the error then the hint shouldn't be logged. Also, it's best if the hint is shown to the user *after* the error, but we cannot do/guarentee that.
  const { viteConfig } = await runPrerender(options, 'prerender()')
  return { viteConfig }
}
async function runPrerenderFromCLIPrerenderCommand(): Promise<void> {
  try {
    const { viteConfigFromUserEnhanced } = await prepareViteApiCall({}, 'prerender')
    await runPrerender({ viteConfig: viteConfigFromUserEnhanced }, '$ vike prerender')
  } catch (err) {
    console.error(err)
    // Error may come from user-land; we need to use logErrorHint()
    logErrorHint(err)
    process.exit(1)
  }
  runPrerender_forceExit()
  assert(false)
}
async function runPrerenderFromAutoRun(viteConfig: InlineConfig | undefined): Promise<{ forceExit: boolean }> {
  try {
    await runPrerender({ viteConfig }, 'auto-run')
  } catch (err) {
    // Avoid Rollup prefixing the error with [vike:build:pluginAutoFullBuild], see for example https://github.com/vikejs/vike/issues/472#issuecomment-1276274203
    console.error(err)
    logErrorHint(err)
    process.exit(1)
  }
  const forceExit = isVikeCli() || isViteCliCall()
  return { forceExit }
}

function runPrerender_forceExit() {
  // Force exit; known situations where pre-rendering is hanging:
  //  - https://github.com/vikejs/vike/discussions/774#discussioncomment-5584551
  //  - https://github.com/vikejs/vike/issues/807#issuecomment-1519010902
  process.exit(0)

  /* I guess there is no need to tell the user about it? Let's see if a user complains.
   * I don't known whether there is a way to call process.exit(0) only if needed, thus I'm not sure if there is a way to conditionally show a assertInfo().
  assertInfo(false, "Pre-rendering was forced exit. (Didn't gracefully exit because the event queue isn't empty. This is usally fine, see ...", { onlyOnce: false })
  */
}
