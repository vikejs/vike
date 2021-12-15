// We remove: https://github.com/vitejs/vite/blob/dd79858ab70d2591e1239ddb19e1ce38d9913b4c/packages/vite/src/node/plugins/ssrRequireHook.ts
// Because it injects `require('module')` into the build which chokes bundlers, such as Cloudflare Workers's webpack-based bundler.
// The minimal added value of deduping React is not worth the trouble; we simply remove Vite's deduping functionality for production.

import type { Plugin } from 'vite'

export { removeRequireHookPlugin }

function removeRequireHookPlugin(): Plugin {
  return {
    name: 'vite-plugin-ssr:removeRequireHookPlugin',
    apply: 'build',
    configResolved(config) {
      const pluginsMod = config.plugins.filter((plugin) => plugin.name !== 'vite:ssr-require-hook')
      // @ts-ignore
      config.plugins = pluginsMod
    },
  }
}
