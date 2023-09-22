export { commonConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import { assert, assertWarning, findUserPackageJsonPath } from '../utils.js'
import { assertRollupInput } from './buildConfig.js'
import { installRequireShim_setUserRootDir } from '@brillout/require-shim'
import pc from '@brillout/picocolors'
import path from 'path'
import { createRequire } from 'module'
import { assertResolveAlias } from './commonConfig/assertResolveAlias.js'
// @ts-ignore Shimed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)

function commonConfig(): Plugin[] {
  return [
    {
      name: 'vike.devmonConfig-1',
      config: () => ({
        appType: 'custom',
        ssr: {
          // Needed as long as VPS is published as CJS.
          // TODO: can we remove this once VPS is published as ESM?
          external: ['vike', 'vike/server']
        }
      }),
      configResolved(config) {
        installRequireShim_setUserRootDir(config.root)
      }
    },
    {
      name: 'vike.devmonConfig-2',
      enforce: 'post',
      configResolved: {
        order: 'post',
        handler(config) {
          setDefaultPort(config)
          workaroundCI(config)
          assertRollupInput(config)
          assertResolveAlias(config)
          assertEsm(config.root)
        }
      }
    }
  ]
}

function setDefaultPort(config: ResolvedConfig) {
  // @ts-ignore
  config.server ??= {}
  config.server.port ??= 3000
  // @ts-ignore
  config.preview ??= {}
  config.preview.port ??= 3000
}

// Workaround GitHub Action failing to access the server
function workaroundCI(config: ResolvedConfig) {
  if (process.env.CI) {
    config.server.host ??= true
    config.preview.host ??= true
  }
}

function assertEsm(userViteRoot: string) {
  const packageJsonPath = findUserPackageJsonPath(userViteRoot)
  if (!packageJsonPath) return
  const packageJson = require_(packageJsonPath)
  let dir = path.dirname(packageJsonPath)
  if (dir !== '/') {
    assert(!dir.endsWith('/'))
    dir = dir + '/'
  }
  assert(dir.endsWith('/'))
  dir = pc.dim(dir)
  assertWarning(
    packageJson.type === 'module',
    `We recommend setting ${dir}package.json#type to "module" (and therefore writing ESM code instead of CJS code), see https://vike.dev/CJS`,
    { onlyOnce: true }
  )
}
