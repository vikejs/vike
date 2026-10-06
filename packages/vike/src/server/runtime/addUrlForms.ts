export { addUrlForms }

import {
  enhance,
  getUniversal,
  getUniversalProp,
  pathSymbol,
  type EnhancedMiddleware,
} from '@universal-middleware/core'
import { prependBase } from '../../utils/parseUrl-extras.js'
import '../assertEnvServer.js'

// A +middleware with a `path` also runs for Vike's own forms of that URL: with the Base URL, and its `.pageContext.json` twin (`/dash` => `/dash/index.pageContext.json`)
function addUrlForms(middleware: EnhancedMiddleware, baseServer: string): EnhancedMiddleware[] {
  const path = getUniversalProp(middleware, pathSymbol)
  if (!path) return [middleware]
  const paths = [path]
  if (!path.endsWith('/**')) paths.push(`${path.replace(/\/$/, '')}/index.pageContext.json`)
  const pathsWithBase = paths.map((path) => prependBase(path, baseServer))
  return [...new Set([...paths, ...pathsWithBase])].map((path) => enhance(getUniversal(middleware), { path }))
}
