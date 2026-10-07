export { normalizeMiddlewarePath }

import {
  enhance,
  getUniversal,
  getUniversalProp,
  pathSymbol,
  type EnhancedMiddleware,
} from '@universal-middleware/core'
import { assertWarning } from '../../utils/assert.js'
import '../assertEnvServer.js'

function normalizeMiddlewarePath(middleware: EnhancedMiddleware): EnhancedMiddleware {
  let path = getUniversalProp(middleware, pathSymbol)
  if (!path) return middleware
  // Since Universal Middleware 0.5 a `-` ends a parameter name, so `/users/:user-id` means `:user` followed by `-id` and no
  // longer runs for `/users/123`
  assertWarning(
    !/:\w+-(?!:)/.test(path),
    `The +middleware path ${path} has a - right after a parameter name: the name ends at the -, so the +middleware doesn't run for a URL without that suffix. Rename the parameter (:userId instead of :user-id).`,
    { onlyOnce: `middleware-path:${path}` },
  )
  // The router matches `dash` as `/dash`
  if (path.startsWith('/') || path.startsWith('{')) return middleware
  path = `/${path}`
  return enhance(getUniversal(middleware), { path })
}
