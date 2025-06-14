export { assertResolveAlias }

import type { ResolvedConfig } from 'vite'
import { assert, assertUsage, assertWarning, isArray, isPathAliasRecommended } from '../../utils.js'
import pc from '@brillout/picocolors'

// Recommend users to avoid un-distinguishable path aliases.

// There are a lot of libraries that don't or cannot follow that recommendation, for example:
// - Nx
//   - Not sure why, but Nx seems to add a path alias for each monorepo package
//   - https://github.com/vikejs/vike/discussions/1134
// - MUI
//   - https://mui.com/material-ui/guides/minimizing-bundle-size/#how-to-use-custom-bundles
//   - https://github.com/vikejs/vike/discussions/1549#discussioncomment-8789002
// - @preact/preset-vite
//   - Aliases react imports
// - @vitejs/plugin-vue2
//   - https://github.com/vikejs/vike/issues/1329

function assertResolveAlias(config: ResolvedConfig) {
  // TODO: re-implement warning https://github.com/vikejs/vike/issues/1567
  return
  const aliases = getAliases(config)
  const errPrefix = config.configFile || 'Your Vite configuration'
  const errSuffix1 = 'see https://vike.dev/path-aliases#vite'
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
          onlyOnce: true,
        })
      }
    } else {
      // Allow un-distinguishable aliases set by @preact/preset-vite
      if (find.startsWith('react')) return

      // Allow un-distinguishable aliases set by @vitejs/plugin-vue2 https://github.com/vikejs/vike/issues/1329
      if (find === 'vue') return

      {
        const msg = `${errPrefix} defines an invalid ${pc.cyan(
          'resolve.alias',
        )}: a path alias cannot be the empty string ${pc.cyan("''")}` as const
        assertUsage(find !== '', msg)
      }

      // Ensure path alias are distinguishable from npm package names, which is needed by:
      //  - determineOptimizeDeps()
      //  - extractAssets
      //  - in general: using un-distinguishable path aliases is asking for trouble
      if (!isPathAliasRecommended(find)) {
        if (find.startsWith('@')) {
          const msg =
            `${errPrefix} defines an invalid resolve.alias ${deprecation}: a path alias cannot start with ${pc.cyan(
              '@',
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
  if (!isArray(alias)) {
    return [alias]
  } else {
    return alias
  }
}
