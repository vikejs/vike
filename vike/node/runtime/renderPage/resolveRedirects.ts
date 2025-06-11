export { resolveRedirects }
export { getStaticRedirectsForPrerender }

// For ./resolveRedirects.spec.ts
export { resolveRouteStringRedirect }

import { assertIsNotBrowser } from '../../../utils/assertIsNotBrowser.js'
import {
  assert,
  assertUsage,
  assertUsageUrlRedirectTarget,
  assertWarning,
  isUrlRedirectTarget
} from '../../../shared/utils.js'
import { resolveUrlPathname } from '../../../shared/route/resolveUrlPathname.js'
import { assertRouteString, isStaticRouteString, resolveRouteString } from '../../../shared/route/resolveRouteString.js'
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

function getStaticRedirectsForPrerender(redirectsAll: Record<string, string>[]): Record<string, string> {
  const redirects = merge(redirectsAll)
  const redirectsStatic: Record<string, string> = {}
  for (const [urlSource, urlTarget] of Object.entries(redirects)) {
    assertRedirect(urlSource, urlTarget)
    if (isStaticRouteString(urlSource)) {
      redirectsStatic[urlSource] = urlTarget
    } else {
      assertWarning(false, `Dynamic redirect ${pc.cyan(urlSource)} -> ${pc.cyan(urlTarget)} cannot be pre-rendered`, {
        onlyOnce: true
      })
    }
  }
  return redirectsStatic
}

function resolveRouteStringRedirect(urlSource: string, urlTarget: string, urlPathname: string): null | string {
  assertRedirect(urlSource, urlTarget)
  const match = resolveRouteString(urlSource, urlPathname)
  if (!match) return null
  const urlResolved = resolveUrlPathname(urlTarget, match.routeParams)
  if (urlResolved === urlPathname) return null
  assert(isUrlRedirectTarget(urlResolved))
  return urlResolved
}

function assertRedirect(urlSource: string, urlTarget: string) {
  assertRouteString(urlSource, `${redirectsErrPrefix} Invalid`)
  // Is allowing any protocol a safety issue? https://github.com/vikejs/vike/pull/1292#issuecomment-1828043917
  assertUsageUrlRedirectTarget(urlTarget, `${redirectsErrPrefix} The URL redirection target`, true)
  assertParams(urlSource, urlTarget)
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
