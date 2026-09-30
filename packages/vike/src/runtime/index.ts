// - Vike replaces `vike/runtime` with a virtual module bound to the Vite environment that imports it, see generateVirtualFileRuntime.ts
// - This file is only used for its types, and when `vike/runtime` is imported by code that Vite doesn't process
export { environmentName, viteEnvironmentName, loadPageConfig }
export type { PageConfigPublic }

import { assertUsage } from '../utils/assert.js'
import type { PageConfigPublic } from '../shared-server-client/page-configs/resolveVikeConfigPublic.js'

/** The name of the Vike environment, e.g. `server`, `client` or `rsc`.
 *
 * @experimental
 *
 * https://vike.dev/vike-runtime
 */
const environmentName: string = unavailable()
/** The name of the Vite environment, e.g. `ssr`, `client` or `rsc`.
 *
 * @experimental
 *
 * https://vike.dev/vike-runtime
 */
const viteEnvironmentName: string = unavailable()

/** Load the config values of a page that live in the current environment.
 *
 * @experimental
 *
 * https://vike.dev/vike-runtime
 */
async function loadPageConfig(_pageId: string): Promise<PageConfigPublic> {
  return unavailable()
}

function unavailable(): never {
  assertUsage(
    false,
    `${JSON.stringify('vike/runtime')} can only be imported by modules that Vite transforms for the environment they run in: if it's imported by a package in node_modules, then add that package to ${JSON.stringify('resolve.noExternal')} of every server environment that loads it. It can't be imported from +config files or from Node.js code that Vite doesn't process. See https://vike.dev/vike-runtime`,
  )
}
