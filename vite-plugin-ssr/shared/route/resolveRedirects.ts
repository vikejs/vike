export { resolveRedirects }
export { resolveRouteStringRedirect }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.js'
import { assert, assertUsage } from '../utils.js'
import { assertRouteString, resolveRouteString } from './resolveRouteString.js'
import pc from '@brillout/picocolors'
assertIsNotBrowser() // Don't bloat the client

// TODO/v1-release: update
const redirectSrc = '[vite.config.js > ssr({ redirects })]'

function resolveRedirects(redirects: Record<string, string>, urlPathname: string): null | string {
  for (const [routeStringSource, routeStringTarget] of Object.entries(redirects)) {
    const urlTarget = resolveRouteStringRedirect(routeStringSource, routeStringTarget, urlPathname)
    if (urlTarget) return urlTarget
  }
  return null
}

function resolveRouteStringRedirect(
  routeStringSource: string,
  routeStringTarget: string,
  urlPathname: string
): null | string {
  assertRouteString(routeStringSource, `${redirectSrc} Invalid`)
  assertRouteString(routeStringTarget, `${redirectSrc} Invalid`)
  assertParams(routeStringSource, routeStringTarget)
  const match = resolveRouteString(routeStringSource, urlPathname)
  if (!match) return null
  let urlTarget = routeStringTarget
  Object.entries(match.routeParams).forEach(([key, val]) => {
    urlTarget = urlTarget.replaceAll(`@${key}`, val)
  })
  assert(!urlTarget.includes('@'))
  if (urlTarget === urlPathname) return null
  return urlTarget
}

function assertParams(routeStringSource: string, routeStringTarget: string) {
  const routeSegments = routeStringTarget.split('/')
  routeSegments.forEach((routeSegment) => {
    if (routeSegment.startsWith('@')) {
      const segments = routeStringSource.split('/')
      assertUsage(
        segments.includes(routeSegment),
        `${redirectSrc} The redirect source ${highlight(routeStringSource)} is missing the URL parameter ${highlight(
          routeSegment
        )} used by the redirect target ${highlight(routeStringTarget)}`
      )
    }
  })
}

function highlight(str: string) {
  return pc.bold(str)
}
