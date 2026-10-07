export { addUrlForms }

import {
  enhance,
  getUniversal,
  getUniversalProp,
  pathSymbol,
  type EnhancedMiddleware,
} from '@universal-middleware/core'
import { getPageContextRequestUrl } from '../../shared-server-client/getPageContextRequestUrl.js'
import { prependBase } from '../../utils/parseUrl-extras.js'
import { assertWarning } from '../../utils/assert.js'
import '../assertEnvServer.js'

// A +middleware with a `path` also runs for Vike's own forms of that URL: with the Base URL, and its `.pageContext.json` twin (`/dash` => `/dash/index.pageContext.json`)
function addUrlForms(middleware: EnhancedMiddleware, baseServer: string): EnhancedMiddleware[] {
  let path = getUniversalProp(middleware, pathSymbol)
  if (!path) return [middleware]
  // The router matches `dash` as `/dash`
  if (!path.startsWith('/')) path = `/${path}`
  // Since Universal Middleware 0.5 a `-` ends a parameter name, so `/users/:user-id` means `:user` followed by `-id` and no
  // longer runs for `/users/123`
  assertWarning(
    !/:\w+-(?!:)/.test(path),
    `The +middleware path ${path} has a - right after a parameter name: the name ends at the -, so the +middleware doesn't run for a URL without that suffix. Rename the parameter (:userId instead of :user-id).`,
    { onlyOnce: `middleware-path:${path}` },
  )
  const paths = [path]
  if (!path.endsWith('/**')) paths.push(getPageContextRequestUrl(path))
  const pathsWithBase = paths.map((path) => prependBase(path, baseServer))
  return [...new Set([...paths, ...pathsWithBase])].map((path) => enhance(getUniversal(middleware), { path }))
}
