export { createDevMiddleware_ as createDevMiddleware }

// We use a dynamic import because createDevMiddleware() imports `vite` and should, therefore, never be loaded in production.
// - We avoid bundlers from bundling createDevMiddleware()
//   - Copied from https://github.com/brillout/import/blob/ba848455442484eb258aaa2d9864d4848e4ed0fb/index.ts#L11-L12
import type { createDevMiddleware as createDevMiddlewareType } from '../../node/createDevMiddleware.js'
import '../assertEnvServer.js'
const createDevMiddleware_: typeof createDevMiddlewareType = async (...args) => {
  const p = '../../node/createDevMiddleware.js'
  // Absolute URL, because on Windows Vite's ssrLoadModule() resolves a relative dynamic import to `D:/...` and then fails to load it (e.g. if `vike` is linked and `$ vike dev` runs +serverEntry.js)
  const url = new URL(p, import.meta.url).href
  const { createDevMiddleware } = await import(/*webpackIgnore: true*/ /* @vite-ignore */ url)
  return createDevMiddleware(...args)
}
