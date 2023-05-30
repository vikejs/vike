export { commonConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import { addRequireShim_setUserRootDir, assert, assertWarning } from '../utils'
import { assertRollupInput } from './buildConfig'

function commonConfig(): Plugin[] {
  return [
    {
      name: 'vite-plugin-ssr:commonConfig-1',
      config: () => ({
        appType: 'custom',
        ssr: {
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

function assertResolveAlias(config: ResolvedConfig) {
  const aliases = getAliases(config)
  const errPrefix = config.configFile || 'Your Vite configuration'
  const errSuffix = "follow the '#' prefix convention, see https://vite-plugin-ssr.com/path-aliases#vite"
  aliases.forEach((alias) => {
    const { customResolver, find } = alias
    assertWarning(
      customResolver === undefined,
      `${errPrefix} defines resolve.alias with customResolver() which we recommend against, use a string instead and ${errSuffix}`
    )
    if (typeof find !== 'string') {
      assert(find instanceof RegExp)
      // Skip aliases set by Vite:
      //   /^\/?@vite\/env/
      //   /^\/?@vite\/client/
      if (find.toString().includes('@vite')) return
      assertWarning(
        false,
        `${errPrefix} defines resolve.alias with a RegExp ${find} which we recommend against, use a string instead and ${errSuffix}`
      )
    } else {
      // Skip alias set by @preact/preset-vite
      if (find.startsWith('react')) return
      assertWarning(find.startsWith('#'), `${errPrefix} defines an alias '${find}' that doesn't ${errSuffix}`)
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
