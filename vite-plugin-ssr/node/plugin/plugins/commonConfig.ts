export { commonConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import { addRequireShim_setUserRootDir, assert, assertWarning, isValidPathAlias } from '../utils'
import { assertRollupInput } from './buildConfig'

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
        addRequireShim_setUserRootDir(config.root)
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
  const errSuffix2 =
    `which will be deprecated in the next major release, use a string insead and ${errSuffix1}` as const
  aliases.forEach((alias) => {
    const { customResolver, find } = alias
    assertWarning(
      customResolver === undefined,
      `${errPrefix} defines resolve.alias with customResolver() ${errSuffix2}`
    )
    if (typeof find !== 'string') {
      assert(find instanceof RegExp)
      // Skip aliases set by Vite:
      //   /^\/?@vite\/env/
      //   /^\/?@vite\/client/
      if (find.toString().includes('@vite')) return
      // Skip alias /^solid-refresh$/ set by vite-plugin-solid
      if (find.toString().includes('solid-refresh')) return
      assertWarning(false, `${errPrefix} defines resolve.alias with a regular expression ${errSuffix2}`)
    } else {
      // Skip aliases set by @preact/preset-vite
      if (find.startsWith('react')) return
      assertWarning(
        isValidPathAlias(find),
        `${errPrefix} defines an alias '${find}' that cannot be distinguished from npm package imports, ${errSuffix1}`
      )
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
