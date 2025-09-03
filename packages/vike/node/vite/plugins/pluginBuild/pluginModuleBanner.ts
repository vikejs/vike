export { pluginModuleBanner }

import type { ResolvedConfig, Plugin } from 'vite'
import { assert, removeVirtualFileIdPrefix } from '../../utils.js'
import { getMagicString } from '../../shared/getMagicString.js'

// Rollup's banner feature doesn't work with Vite: https://github.com/vitejs/vite/issues/8412
// But, anyways, we want to prepend the banner at the beginning of each module, not at the beginning of each file (I believe that's what Rollup's banner feature does).

function pluginModuleBanner(): Plugin {
  let config: ResolvedConfig

  return {
    name: 'vike:build:pluginModuleBanner',
    enforce: 'post',
    apply: 'build',
    applyToEnvironment(environment) {
      const { config } = environment
      const { consumer } = config
      const { minify } = config.build
      assert(minify === false || minify, { minify, consumer })
      return !minify
    },
    configResolved: {
      handler(config_) {
        config = config_
      },
    },
    transform: {
      order: 'post',
      /* Using a Rolldown hook filter doesn't make sense here — we use applyToEnvironment() to conditionally apply this plugin.
      filter: {},
      */
      handler(code, id) {
        const { minify } = this.environment.config.build
        assert(minify === false, { minify })
        if (id.startsWith('\0')) id = id
        id = removeVirtualFileIdPrefix(id)
        if (id.startsWith(config.root)) id = id.slice(config.root.length + 1)
        id = id.replaceAll('*/', '*\\/') // https://github.com/vikejs/vike/issues/2377
        const { magicString, getMagicStringResult } = getMagicString(code, id)
        // Use legal comment so that esbuild doesn't remove it.
        // - Terser still removes the comment, but I guess users use terser to minify JavaScript so I guess it's a good thing that comment is removed.
        // - https://esbuild.github.io/api/#legal-comments
        magicString.prepend(`/*! ${id} [vike:pluginModuleBanner] */\n`)
        return getMagicStringResult()
      },
    },
  }
}
