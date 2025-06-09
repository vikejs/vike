export { runPrerenderFromAPI }
export { runPrerenderFromCLIPrerenderCommand }
export { runPrerenderFromAutoRun }
export { runPrerenderExec_isChildProcess }
export type { PrerenderOptionsAPI }

import { assert, assertPosixPath } from './utils.js'
import type { InlineConfig, ResolvedConfig } from 'vite'
import { logErrorHint } from '../runtime/renderPage/logErrorHint.js'
import { prepareViteApiCall } from '../api/prepareViteApiCall.js'
import { PrerenderArgs, runPrerender, type PrerenderOptions, type RunPrerender } from './runPrerender.js'
import { fork } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { genPromise } from '../runtime/utils.js'
// @ts-ignore import.meta.url is shimmed at dist/cjs by dist-cjs-fixup.js.
const importMetaUrl: string = import.meta.url
assertPosixPath(importMetaUrl)
const __dirname_ = path.posix.dirname(fileURLToPath(importMetaUrl))
assertPosixPath(__dirname_)
const runPrerenderPath = 'runPrerender.js'
const child = fork(path.join(__dirname_, runPrerenderPath))

type RunPrerenderReturn = Awaited<ReturnType<RunPrerender>>
const runPrerenderWithSeparateProcess = (...args: PrerenderArgs) => {
  const { promise, resolve } = genPromise<void>({ timeout: null })
  child.send({ action: 'runPrerenderExec', args })
  child.on('message', (msg: { result: RunPrerenderReturn } | { failed: true }) => {
    if ('failed' in msg) process.exit(1)
    resolve()
  })
  return promise
}
function runPrerenderExec_isChildProcess(): boolean {
  return !!process.argv[1]?.endsWith(runPrerenderPath)
}

type PrerenderOptionsAPI = PrerenderOptions & { doNotRunInSeparateProcess?: boolean }
async function runPrerenderFromAPI(options: PrerenderOptionsAPI = {}): Promise<{ viteConfig: ResolvedConfig | null }> {
  // - We purposely propagate the error to the user land, so that the error interrupts the user land. It's also, I guess, a nice-to-have that the user has control over the error.
  // - We don't use logErrorHint() because we don't have control over what happens with the error. For example, if the user land purposely swallows the error then the hint shouldn't be logged. Also, it's best if the hint is shown to the user *after* the error, but we cannot do/guarentee that.
  if (options.doNotRunInSeparateProcess) {
    const { viteConfig } = await runPrerender(options, 'prerender()')
    return { viteConfig }
  } else {
    await runPrerenderWithSeparateProcess(options, 'prerender()')
    return { viteConfig: null }
  }
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
async function runPrerenderFromAutoRun(viteConfig: InlineConfig | undefined): Promise<void> {
  await runPrerenderWithSeparateProcess({ viteConfig }, null)
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
