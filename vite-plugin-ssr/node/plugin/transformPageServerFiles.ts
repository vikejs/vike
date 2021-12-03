import type { Plugin } from 'vite'
import { init, parse } from 'es-module-lexer'
import { assert, isObject } from '../../shared/utils'

export { transformPageServerFiles }

function transformPageServerFiles(): Plugin {
  return {
    name: 'vite-plugin-ssr:transformPageServerFiles',
    async transform(src, id, options) {
      if (isSSR(options)) {
        return
      }
      if (!/\.page\.server\.[a-zA-Z0-9]+$/.test(id)) {
        return
      }
      await init
      const exports = parse(src)[1]
      const hasExportOnBeforeRender = exports.includes('onBeforeRender') ? 'true' : 'false'
      return {
        code: `export const hasExportOnBeforeRender = ${hasExportOnBeforeRender};`,
        // Remove Source Map to save KBs
        //  - https://rollupjs.org/guide/en/#source-code-transformations
        map: { mappings: '' },
      }
    },
  } as Plugin
}

// https://github.com/vitejs/vite/discussions/5109#discussioncomment-1450726
function isSSR(options: undefined | boolean | { ssr?: boolean }): boolean {
  if (options === undefined) {
    return false
  }
  if (typeof options === 'boolean') {
    return options
  }
  if (isObject(options)) {
    return !!options.ssr
  }
  assert(false)
}
