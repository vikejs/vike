export { resolveRedirects }

// For ./resolveRedirects.spec.ts
export { resolveRouteStringRedirect }

import { assertIsNotBrowser } from '../../../utils/assertIsNotBrowser.js'
import { assert, assertUsage, isUrlRedirectTarget } from '../../../shared/utils.js'
import { resolveUrlPathname } from '../../../shared/route/resolveUrlPathname.js'
import { assertRouteString, resolveRouteString } from '../../../shared/route/resolveRouteString.js'
import pc from '@brillout/picocolors'
assertIsNotBrowser() // Don't bloat the client

// TODO/v1-release: update
const configSrc = '[vite.config.js > vike({ redirects })]'

function resolveRedirects(redirects: Record<string, string>, urlPathname: string): null | string {
  for (const [urlSource, urlTarget] of Object.entries(redirects)) {
    const urlResolved = resolveRouteStringRedirect(urlSource, urlTarget, urlPathname)
    if (urlResolved) return urlResolved
  }
  return null
}

function resolveRouteStringRedirect(urlSource: string, urlTarget: string, urlPathname: string): null | string {
  assertRouteString(urlSource, `${configSrc} Invalid`)
  assertUsage(
    // Is allowing any protocol a safety issue? https://github.com/vikejs/vike/pull/1292#issuecomment-1828043917
    isUrlRedirectTarget(urlTarget) || urlTarget === '*',
    `${configSrc} Invalid redirection target ${pc.code(urlTarget)}: it should start with ${pc.code(
      '/'
    )} or a protocol (${pc.code('http://')}, ${pc.code('mailto:')}, ...), or be ${pc.code('*')}`
  )
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
        `${configSrc} The redirection source URL ${pc.code(urlSource)} is missing the URL parameter ${pc.code(
          routeSegment
        )} used by the redirection target URL ${pc.code(urlTarget)}`
      )
    }
  })
}
