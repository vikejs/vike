import type { Plugin } from 'vite'
import { init, parse } from 'es-module-lexer'

export { transformPageServerFiles }

function transformPageServerFiles(): Plugin {
  return {
    name: 'vite-plugin-ssr:packageJsonFile',
    apply: 'build',
    async transform(src, id, ssr) {
      if (ssr) {
        return
      }
      if (!/\.page\.server\.[a-zA-Z0-9]+$/.test(id)) {
        return
      }
      await init
      const exports = parse(src)[1]
      const exportsOnBeforeRender = 'onBeforeRender' in exports ? 'true' : 'false'
      return {
        code: `export const exportsOnBeforeRender = ${exportsOnBeforeRender};`,
        map: null
      }
    }
  } as Plugin
}
