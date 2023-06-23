// Unit tests at ./resolveRouteString.spec.ts

export { resolveRouteString }
export { getUrlFromRouteString }
export { isStaticRouteString }
export { analyzeRouteString }
// export { assertRouteString }

import { assertWarning } from '../utils'
import { assert, assertUsage } from './utils'

const PARAM_TOKEN_NEW = '@'
const PARAM_TOKEN_OLD = ':'

function assertRouteString(routeString: string, errMsgPrefix?: string) {
  assertUsage(
    routeString.startsWith('/') || routeString === '*',
    (() => {
      if (!errMsgPrefix) {
        errMsgPrefix = 'Invalid'
      } else {
        errMsgPrefix = errMsgPrefix + ' invalid'
      }
      const routeStr = [`'${routeString}'`, routeString !== '' ? null : '(empty string)'].filter(Boolean).join(' ')
      const errMsg = `${errMsgPrefix} Route String ${routeStr}: Route Strings should start with a leading slash '/' (or be '*')`
      return errMsg
    })()
  )
}

function resolveRouteString(routeString: string, urlPathname: string): null | { routeParams: Record<string, string> } {
  assertRouteString(routeString)
  assert(urlPathname.startsWith('/'))

  const routeSegments = routeString.split('/')
  const urlSegments = urlPathname.split('/')

  const routeParams: Record<string, string> = {}

  assertGlob(routeString)

  if (routeString === '*') {
    routeString = '/*'
  }

  for (let i = 0; i < Math.max(routeSegments.length, urlSegments.length); i++) {
    const routeSegment = routeSegments[i]
    const urlSegment = urlSegments[i]
    if (routeSegment === '*') {
      routeParams['*'] = urlSegments.slice(Math.max(1, i)).join('/')
      return { routeParams }
    } else if (routeSegment && isParam(routeSegment)) {
      assertWarning(
        !routeSegment.startsWith(PARAM_TOKEN_OLD),
        `Outdated Route String \`${routeString}\`, use \`${routeString
          .split(PARAM_TOKEN_OLD)
          .join(PARAM_TOKEN_NEW)}\` instead.`,
        { showStackTrace: false, onlyOnce: true }
      )
      if (!urlSegment) {
        return null
      }
      routeParams[routeSegment.slice(1)] = urlSegment
    } else {
      if ((routeSegment || '') !== (urlSegment || '')) {
        return null
      }
    }
  }

  return { routeParams }
}

function getUrlFromRouteString(routeString: string): null | string {
  assert(routeString.startsWith('/'))
  if (isStaticRouteString(routeString)) {
    const url = routeString
    return url
  }
  return null
}

function assertGlob(routeString: string) {
  const numberOfGlobChars = routeString.split('*').length - 1
  assertUsage(
    numberOfGlobChars <= 1,
    `Invalid Route String '${routeString}': Route Strings are not allowed to contain more than one glob character '*'`
  )
  assertUsage(
    numberOfGlobChars === 0 || (numberOfGlobChars === 1 && routeString.endsWith('*')),
    `Invalid Route String '${routeString}': make sure your Route String ends with the glob character '*'`
  )
}
function analyzeRouteString(routeString: string) {
  const routeSegments = routeString.split('/').filter((routeSegment) => routeSegment !== '' && routeSegment !== '*')

  let numberOfStaticSegmentsBeginning = 0
  for (const routeSegment of routeSegments) {
    if (isParam(routeSegment)) {
      break
    }
    numberOfStaticSegmentsBeginning++
  }

  const numberOfStaticSegements = routeSegments.filter((s) => !isParam(s)).length
  const numberOfParameterSegments = routeSegments.filter((s) => isParam(s)).length

  const isCatchAll = routeString.endsWith('*')

  return { numberOfParameterSegments, numberOfStaticSegmentsBeginning, numberOfStaticSegements, isCatchAll }
}

function isParam(routeSegment: string) {
  return routeSegment.startsWith(PARAM_TOKEN_NEW) || routeSegment.startsWith(PARAM_TOKEN_OLD)
}

function isStaticRouteString(routeString: string): boolean {
  const url = routeString
  const match = resolveRouteString(routeString, url)
  assert(match)
  return Object.keys(match.routeParams).length === 0
}
