export { workaroundCssModuleHmr }

// https://github.com/vikejs/vike/issues/1127#issuecomment-2294511748

import type { Plugin } from 'vite'

function workaroundCssModuleHmr(): Plugin {
  return {
    name: 'vike:workaroundCssModuleHmr',
    handleHotUpdate(ctx) {
      // prevent full reload due to non self-accepting css module.
      // here only "?direct" module should be filtered out as it doesn't have a parent module.
      if (ctx.file.includes('module.css')) {
        return ctx.modules.filter((m) => !m.id?.includes('?direct'))
      }
    }
  }
}
