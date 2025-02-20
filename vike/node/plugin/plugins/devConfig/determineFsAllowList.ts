export { determineFsAllowList }

import { searchForWorkspaceRoot } from 'vite'
import type { ResolvedConfig } from 'vite'
import path from 'path'
import { assert } from '../../utils.js'
import { createRequire } from 'module'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
// @ts-ignore import.meta.url is shimmed at dist/cjs by dist-cjs-fixup.js.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)
const __dirname_ = dirname(fileURLToPath(importMetaUrl))

async function determineFsAllowList(config: ResolvedConfig) {
  const fsAllow = config.server.fs.allow

  // fsAllow should already contain searchForWorkspaceRoot()
  assert(fsAllow.length >= 1)

  fsAllow.push(process.cwd())
  // searchForWorkspaceRoot() is buggy: https://github.com/vikejs/vike/issues/555.
  // BUt that's not a problem since Vite automatically inserts searchForWorkspaceRoot().
  // We add it again just to be sure.
  fsAllow.push(searchForWorkspaceRoot(process.cwd()))

  // Add node_modules/vike/
  {
    // [RELATIVE_PATH_FROM_DIST] Current directory: node_modules/vike/dist/esm/node/plugin/plugins/config/
    const vikeRoot = path.join(__dirname_, '../../../../../../')
    // Assert that `vikeRoot` is indeed pointing to `node_modules/vike/`
    require_.resolve(`${vikeRoot}/dist/esm/node/plugin/plugins/devConfig/index.js`)
    fsAllow.push(vikeRoot)
  }
}
