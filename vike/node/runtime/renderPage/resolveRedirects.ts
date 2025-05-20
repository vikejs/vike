export { resolveRedirects }

// For ./resolveRedirects.spec.ts
export { resolveRouteStringRedirect }

import { assertIsNotBrowser } from '../../../utils/assertIsNotBrowser.js'
import { assert, assertUsage, assertUsageUrlRedirectTarget, isUrlRedirectTarget } from '../../../shared/utils.js'
import { resolveUrlPathname } from '../../../shared/route/resolveUrlPathname.js'
import { assertRouteString, resolveRouteString } from '../../../shared/route/resolveRouteString.js'
import pc from '@brillout/picocolors'
assertIsNotBrowser() // Don't bloat the client

const redirectsErrPrefix = '[+redirects]'

function resolveRedirects(redirectsAll: Record<string, string>[], urlPathname: string): null | string {
  const redirects = merge(redirectsAll)
  for (const [urlSource, urlTarget] of Object.entries(redirects)) {
    const urlResolved = resolveRouteStringRedirect(urlSource, urlTarget, urlPathname)
    if (urlResolved) return urlResolved
  }
  return null
}

function resolveRouteStringRedirect(urlSource: string, urlTarget: string, urlPathname: string): null | string {
  assertRouteString(urlSource, `${redirectsErrPrefix} Invalid`)
  // Is allowing any protocol a safety issue? https://github.com/vikejs/vike/pull/1292#issuecomment-1828043917
  assertUsageUrlRedirectTarget(urlTarget, `${redirectsErrPrefix} The URL redirection target`, true)
  assertParams(urlSource, urlTarget)
  const match = resolveRouteString(urlSource, urlPathname)
  if (!match) return null
  const urlResolved = resolveUrlPathname(urlTarget, match.routeParams)
  if (urlResolved === urlPathname) return null
  assert(isUrlRedirectTarget(urlResolved))
  return urlResolved
}

function assertParams(urlSource: string, urlTarget: string) {
  const routeSegments = urlTarget.split('/')
  routeSegments.forEach((routeSegment) => {
    if (routeSegment.startsWith('@') || routeSegment.startsWith('*')) {
      const segments = urlSource.split('/')
      assertUsage(
        segments.includes(routeSegment),
        `${redirectsErrPrefix} The redirection source URL ${pc.string(urlSource)} is missing the URL parameter ${pc.string(
          routeSegment
        )} used by the redirection target URL ${pc.string(urlTarget)}`
      )
    }
  })
}

type Obj = Record<string, string>
function merge(objs: (Obj | undefined)[]): Obj {
  const obj: Record<string, string> = {}
  objs.forEach((e) => {
    Object.assign(obj, e)
  })
  return obj
}
