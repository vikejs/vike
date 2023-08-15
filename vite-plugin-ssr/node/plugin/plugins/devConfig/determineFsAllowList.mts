export { determineFsAllowList }

import { searchForWorkspaceRoot } from 'vite'
import type { ResolvedConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import type { ConfigVpsResolved } from '../../../../shared/ConfigVps.mjs'
import { assert } from '../../utils.mjs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

async function determineFsAllowList(config: ResolvedConfig, configVps: ConfigVpsResolved) {
  const fsAllow = config.server.fs.allow

  // fsAllow should already contain searchForWorkspaceRoot()
  assert(fsAllow.length >= 1)

  fsAllow.push(process.cwd())
  // searchForWorkspaceRoot() is buggy: https://github.com/brillout/vite-plugin-ssr/issues/555.
  // BUt that's not a problem since Vite automatically inserts searchForWorkspaceRoot().
  // We add it again just to be sure.
  fsAllow.push(searchForWorkspaceRoot(process.cwd()))

  // Add node_modules/vite-plugin-ssr/
  {
    // [RELATIVE_PATH_FROM_DIST] Current directory: node_modules/vite-plugin-ssr/dist/node/plugin/plugins/config/
    const vitePluginSsrRoot = path.join(__dirname, '../../../../../../')
    // Assert that `vitePluginSsrRoot` is indeed pointing to `node_modules/vite-plugin-ssr/`
    require.resolve(`${vitePluginSsrRoot}/dist/node/plugin/plugins/devConfig/index.mjs`)
    fsAllow.push(vitePluginSsrRoot)
  }

  // Add VPS extensions, e.g. node_modules/stem-react/
  configVps.extensions.forEach(({ npmPackageRootDir }) => {
    const npmPackageRootDirReal = fs.realpathSync(npmPackageRootDir)
    fsAllow.push(npmPackageRootDir)
    fsAllow.push(npmPackageRootDirReal)
  })
}
