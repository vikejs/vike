export { devConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import { searchForWorkspaceRoot } from 'vite'
import { assert, isNotNullish } from '../utils'
import { addSsrMiddleware, assertRoot, isViteCliCall, resolveRoot } from '../helpers'
import { determineOptimizeDepsEntries } from './devConfig/determineOptimizeDepsEntries'
import path from 'path'
import fs from 'fs'
import { getConfigVps } from './config/assertConfigVps'
import { ConfigVpsResolved } from './config/ConfigVps'

function devConfig(): Plugin[] {
  let root: string
  return [
    {
      name: 'vite-plugin-ssr:devConfig',
      async config(config) {
        root = resolveRoot(config) // TODO: remove resolveRoot() helper?
        // TODO: remove?
        // await loadPagesConfig(root)
        return {
          ssr: { external: ['vite-plugin-ssr'] },
          optimizeDeps: {
            exclude: [
              // We exclude the vite-plugin-ssr client to be able to use `import.meta.glob()`
              'vite-plugin-ssr/client',
              'vite-plugin-ssr/client/router',
              'vite-plugin-ssr/routing',
              // - We also exclude @brillout/json-serializer to avoid:
              //   ```
              //   9:28:58 AM [vite] ✨ new dependencies optimized: @brillout/json-serializer/parse
              //   9:28:58 AM [vite] ✨ optimized dependencies changed. reloading
              //   ```
              // - Previously, we had to exclude @brillout/json-serializer because of pnpm, but this doesn't seem to be the case anymore
              '@brillout/json-serializer/parse',
              '@brillout/json-serializer/stringify'
            ]
          }
        }
      },
      async configResolved(config) {
        assertRoot(root, config)
        const configVps = await getConfigVps(config)
        addExtensionsToOptimizeDeps(config, configVps)
        addOptimizeDepsEntries(config, await determineOptimizeDepsEntries(config))
        await determineFsAllowList(config, configVps)
      },
      configureServer(server) {
        if (!isViteCliCall()) return
        return () => {
          addSsrMiddleware(server.middlewares, server)
        }
      }
    }
  ]
}

function addExtensionsToOptimizeDeps(config: ResolvedConfig, configVps: ConfigVpsResolved) {
  config.optimizeDeps.include = config.optimizeDeps.include ?? []
  config.optimizeDeps.include.push(
    ...configVps.extensions
      .map(({ pageFilesDist }) => pageFilesDist)
      .flat()
      .filter(isNotNullish)
      .filter(({ importPath }) => !importPath.endsWith('.css'))
      .map(({ importPath }) => importPath)
  )
  /* Doesn't work since `pageFilesSrc` is a directory. We could make it work by using find-glob.
  config.optimizeDeps.include.push(
    ...configVps.extensions
      .map(({ pageFilesSrc }) => pageFilesSrc)
      .flat()
      .filter(isNotNullish)
  )
  */
}

function addOptimizeDepsEntries(config: ResolvedConfig, entries: string[]) {
  const total = []

  const val = config.optimizeDeps.entries
  if (typeof val === 'string') {
    total.push(val)
  } else if (Array.isArray(val)) {
    total.push(...val)
  } else {
    assert(val === undefined)
  }

  total.push(...entries)

  config.optimizeDeps.entries = total
}

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
    // [RELATIVE_PATH_FROM_DIST] Current directory: node_modules/vite-plugin-ssr/dist/cjs/node/plugin/plugins/
    const vitePluginSsrRoot = path.join(__dirname, '../../../../../')
    // Assert that `vitePluginSsrRoot` is indeed pointing to `node_modules/vite-plugin-ssr/`
    require.resolve(`${vitePluginSsrRoot}/dist/cjs/node/plugin/plugins/devConfig.js`)
    fsAllow.push(vitePluginSsrRoot)
  }

  // Add VPS extensions, e.g. node_modules/stem-react/
  configVps.extensions.forEach(({ npmPackageRootDir }) => {
    const npmPackageRootDirReal = fs.realpathSync(npmPackageRootDir)
    fsAllow.push(npmPackageRootDir)
    fsAllow.push(npmPackageRootDirReal)
  })
}
