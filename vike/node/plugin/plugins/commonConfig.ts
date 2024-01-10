export { commonConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import { version } from 'vite'
import { assert, assertWarning, findUserPackageJsonPath } from '../utils.js'
import { assertRollupInput } from './buildConfig.js'
import { installRequireShim_setUserRootDir } from '@brillout/require-shim'
import pc from '@brillout/picocolors'
import path from 'path'
import { createRequire } from 'module'
import { assertResolveAlias } from './commonConfig/assertResolveAlias.js'
// @ts-ignore Shimmed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)

function commonConfig(): Plugin[] {
  return [
    {
      name: 'vike-commonConfig-1',
      configResolved(config) {
        installRequireShim_setUserRootDir(config.root)
      }
    },
    {
      name: 'vike-.commonConfig-2',
      enforce: 'post',
      configResolved: {
        order: 'post',
        handler(config) {
          overrideViteDefaultPort(config)
          overrideViteDefaultSsrExternal(config)
          workaroundCI(config)
          assertRollupInput(config)
          assertResolveAlias(config)
          assertEsm(config.root)
        }
      }
    }
  ]
}

function overrideViteDefaultPort(config: ResolvedConfig) {
  // @ts-ignore
  config.server ??= {}
  config.server.port ??= 3000
  // @ts-ignore
  config.preview ??= {}
  config.preview.port ??= 3000
}
function overrideViteDefaultSsrExternal(config: ResolvedConfig) {
  if (isViteVersionWithSsrExternalTrue()) return
  // @ts-ignore Not released yet: https://github.com/vitejs/vite/pull/10939/files#diff-5a3d42620df2c6b17e25f440ffdb67683dee7ef57317674d19f41d5f30502310L5
  config.ssr.external ??= true
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
    `We recommend setting ${dir}package.json#type to "module", see https://vike.dev/CJS`,
    { onlyOnce: true }
  )
}

function isViteVersionWithSsrExternalTrue(): boolean {
  const versionParts = version.split('.').map((s) => parseInt(s, 10)) as [number, number, number]
  assert(versionParts.length === 3)
  if (versionParts[0] > 5) return true
  if (versionParts[1] > 0) return true
  if (versionParts[2] >= 12) return true
  return false
}
