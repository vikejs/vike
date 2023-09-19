export { commonConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import { assert, assertUsage, assertWarning, findUserPackageJsonPath, isValidPathAlias } from '../utils.js'
import { assertRollupInput } from './buildConfig.js'
import { installRequireShim_setUserRootDir } from '@brillout/require-shim'
import pc from '@brillout/picocolors'
import path from 'path'
import { createRequire } from 'module'
// @ts-ignore Shimed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)

function commonConfig(): Plugin[] {
  return [
    {
      name: 'vite-plugin-ssr:commonConfig-1',
      config: () => ({
        appType: 'custom',
        ssr: {
          // Needed as long as VPS is published as CJS.
          // TODO: can we remove this once VPS is published as ESM?
          external: ['vite-plugin-ssr', 'vite-plugin-ssr/server']
        }
      }),
      configResolved(config) {
        installRequireShim_setUserRootDir(config.root)
      }
    },
    {
      name: 'vite-plugin-ssr:commonConfig-2',
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

// TODO/v1-release: replace assertWarning() with assertUsage()
function assertResolveAlias(config: ResolvedConfig) {
  const aliases = getAliases(config)
  const errPrefix = config.configFile || 'Your Vite configuration'
  const errSuffix1 = 'see https://vite-plugin-ssr.com/path-aliases#vite'
  const deprecation = 'which will be deprecated in the next major release'
  const errSuffix2 = `${deprecation}, use a string insead and ${errSuffix1}` as const
  aliases.forEach((alias) => {
    const { customResolver, find } = alias
    {
      const msg = `${errPrefix} defines resolve.alias with customResolver() ${errSuffix2}` as const
      assertWarning(customResolver === undefined, msg, { onlyOnce: true })
    }
    if (typeof find !== 'string') {
      assert(find instanceof RegExp)
      // Skip aliases set by Vite:
      //   /^\/?@vite\/env/
      //   /^\/?@vite\/client/
      if (find.toString().includes('@vite')) return
      // Skip alias /^solid-refresh$/ set by vite-plugin-solid
      if (find.toString().includes('solid-refresh')) return
      {
        const msg = `${errPrefix} defines resolve.alias with a regular expression ${errSuffix2}` as const
        assertWarning(false, msg, {
          onlyOnce: true
        })
      }
    } else {
      // Skip aliases set by @preact/preset-vite
      if (find.startsWith('react')) return
      {
        const msg = `${errPrefix} defines an invalid ${pc.cyan(
          'resolve.alias'
        )}: a path alias cannot be the empty string ${pc.cyan("''")}` as const
        assertUsage(find !== '', msg)
      }
      if (!isValidPathAlias(find)) {
        if (find.startsWith('@')) {
          const msg =
            `${errPrefix} defines an invalid resolve.alias ${deprecation}: a path alias cannot start with ${pc.cyan(
              '@'
            )}, ${errSuffix1}` as const
          assertWarning(false, msg, { onlyOnce: true })
        } else {
          const msg =
            `${errPrefix} defines an invalid resolve.alias ${deprecation}: a path alias needs to start with a special character, ${errSuffix1}` as const
          assertWarning(false, msg, { onlyOnce: true })
        }
      }
    }
  })
}
function getAliases(config: ResolvedConfig) {
  const { alias } = config.resolve
  if (!Array.isArray(alias)) {
    return [alias]
  } else {
    return alias
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
    `We recommend setting ${dir}package.json#type to "module" (and therefore writing ESM code instead of CJS code), see https://vite-plugin-ssr.com/CJS`,
    { onlyOnce: true }
  )
}
