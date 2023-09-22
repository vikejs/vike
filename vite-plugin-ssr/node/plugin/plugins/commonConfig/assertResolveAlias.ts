export { assertResolveAlias }

import type { ResolvedConfig } from 'vite'
import { assert, assertUsage, assertWarning, isValidPathAlias } from '../../utils.js'
import pc from '@brillout/picocolors'

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
      // Allow un-distinguishable aliases set by @preact/preset-vite
      if (find.startsWith('react')) return

      {
        const msg = `${errPrefix} defines an invalid ${pc.cyan(
          'resolve.alias'
        )}: a path alias cannot be the empty string ${pc.cyan("''")}` as const
        assertUsage(find !== '', msg)
      }

      // Ensure path alias are distinguishable from npm package names, which is needed by:
      //  - determineOptimizeDeps()
      //  - extractAssets
      //  - in general: using un-distinguishable path aliases is asking for trouble
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
