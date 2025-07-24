export { pluginWorkaroundCssModuleHmr }

// https://github.com/vikejs/vike/issues/1127#issuecomment-2294511748

import type { Plugin } from 'vite'

function pluginWorkaroundCssModuleHmr(): Plugin {
  return {
    name: 'vike:pluginWorkaroundCssModuleHmr',
    handleHotUpdate(ctx) {
      if (true as boolean) return

      // console.log('handleHotUpdate', ctx.file, Object.keys(ctx))
      // console.log('ctx.modules', ctx.modules)
      // console.log('ctx.modules.length', ctx.modules.length)
      // if (true as boolean) return [];

      // prevent full reload due to non self-accepting css module.
      // here only "?direct" module should be filtered out as it doesn't have a parent module.
      if (ctx.file.includes('module.css')) {
        return ctx.modules.filter((m) => !m.id?.includes('?direct'))
      }
    },
  }
}
