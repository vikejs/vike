export { determineFsAllowList }

import { searchForWorkspaceRoot } from 'vite'
import type { ResolvedConfig } from 'vite'
import path from 'node:path'
import { assert, assertPosixPath, getPackageNodeModulesDirectory } from '../../utils.js'
import { fileURLToPath } from 'node:url'
// @ts-ignore import.meta.url is shimmed at dist/cjs by dist-cjs-fixup.js.
const importMetaUrl: string = import.meta.url
assertPosixPath(importMetaUrl)
const __dirname_ = path.posix.dirname(fileURLToPath(importMetaUrl))
assertPosixPath(__dirname_)

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
  const vikeNodeModulesRoot = getPackageNodeModulesDirectory()
  fsAllow.push(vikeNodeModulesRoot)
}
