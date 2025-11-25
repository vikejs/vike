export { createDevMiddleware_ as createDevMiddleware }

// We use a dynamic import because createDevMiddleware() imports `vite` and should, therefore, never be loaded in production.
// - We avoid bundlers from bundling createDevMiddleware()
//   - Copied from https://github.com/brillout/import/blob/ba848455442484eb258aaa2d9864d4848e4ed0fb/index.ts#L11-L12
import type { createDevMiddleware as createDevMiddlewareType } from '../runtime-dev/createDevMiddleware.js'
const createDevMiddleware_: typeof createDevMiddlewareType = async (...args) => {
  const p = './createDevMiddleware.js'
  const { createDevMiddleware } = await import(/*webpackIgnore: true*/ /* @vite-ignore */ p)
  return createDevMiddleware(...args)
}
