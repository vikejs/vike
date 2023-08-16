export { resolveRouteString }
export { getUrlFromRouteString }
export { isStaticRouteString }
export { analyzeRouteString }
export { assertRouteString }

import { assertWarning, isBrowser } from '../utils.js'
import { assert, assertUsage } from './utils.js'
import pc from '@brillout/picocolors'

const PARAM_TOKEN_NEW = '@'
// TODO/v1-release: remove
const PARAM_TOKEN_OLD = ':'

function assertRouteString(routeString: string, errPrefix: `${string}Invalid` | `${string}invalid` = 'Invalid') {
  assert(errPrefix.endsWith('Invalid') || errPrefix.endsWith('invalid'))
  assertUsage(
    routeString !== '',
    `${errPrefix} Route String ${highlight(routeString)} (empty string): set it to ${highlight('/')} instead`
  )
  assertUsage(
    routeString.startsWith('/') || routeString === '*',
    `${errPrefix} Route String ${highlight(routeString)}: Route Strings should start with a leading slash ${highlight(
      '/'
    )} (or be ${highlight('*')})`
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
        { onlyOnce: true }
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
    `Invalid Route String ${highlight(
      routeString
    )}: Route Strings aren't allowed to contain more than one glob ${highlight('*')}`
  )
  assertUsage(
    numberOfGlobChars === 0 || (numberOfGlobChars === 1 && routeString.endsWith('*')),
    `Invalid Route String ${highlight(routeString)}: make sure it ends with ${highlight('*')}`
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

function highlight(routeString: string) {
  if (isBrowser()) {
    return `'${routeString}'`
  } else {
    if (routeString === '') {
      routeString = "''"
    }
    return pc.bold(routeString)
  }
}
