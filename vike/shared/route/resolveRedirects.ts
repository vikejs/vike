export { resolveRedirects }

// For ./resolveRedirects.spec.ts
export { resolveRouteStringRedirect }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.js'
import { assert, assertUsage } from '../utils.js'
import { assertRouteString, resolveRouteString } from './resolveRouteString.js'
import pc from '@brillout/picocolors'
assertIsNotBrowser() // Don't bloat the client

// TODO/v1-release: update
const configSrc = '[vite.config.js > ssr({ redirects })]'

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
    urlTarget.startsWith('/') ||
      urlTarget.startsWith('http://') ||
      urlTarget.startsWith('https://') ||
      urlTarget === '*',
    `${configSrc} Invalid redirection target URL ${pc.cyan(urlTarget)}: the target URL should start with ${pc.cyan(
      '/'
    )}, ${pc.cyan('http://')}, ${pc.cyan('https://')}, or be ${pc.cyan('*')}`
  )
  assertParams(urlSource, urlTarget)
  const match = resolveRouteString(urlSource, urlPathname)
  if (!match) return null
  let urlResolved = urlTarget
  Object.entries(match.routeParams).forEach(([key, val]) => {
    if (key !== '*') {
      key = `@${key}`
    }
    urlResolved = urlResolved.replaceAll(key, val)
  })
  assert(!urlResolved.includes('@'))
  if (urlResolved === urlPathname) return null
  assert(urlTarget.startsWith('/') || urlTarget.startsWith('http'))
  return urlResolved
}

function assertParams(urlSource: string, urlTarget: string) {
  const routeSegments = urlTarget.split('/')
  routeSegments.forEach((routeSegment) => {
    if (routeSegment.startsWith('@') || routeSegment.startsWith('*')) {
      const segments = urlSource.split('/')
      assertUsage(
        segments.includes(routeSegment),
        `${configSrc} The redirection source URL ${pc.cyan(urlSource)} is missing the URL parameter ${pc.cyan(
          routeSegment
        )} used by the redirection target URL ${pc.cyan(urlTarget)}`
      )
    }
  })
}
