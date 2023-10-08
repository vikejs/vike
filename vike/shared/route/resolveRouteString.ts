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

// TODO: precedence
function resolveRouteString(routeString: string, urlPathname: string): null | { routeParams: Record<string, string> } {
  const routeSegments = splitRouteString(routeString)
  //*
  console.log()
  console.log('routeString', routeString)
  console.log('urlPathname', urlPathname)
  console.log('routeSegments', routeSegments)
  //*/
  let urlRest = urlPathname

  const routeParams: Record<string, string> = {}
  const globs: string[] = []
  let isGlobbing:
    | false
    | {
        match: string[]
        isTrailingGlob?: true
      } = false
  let isParam: false | string = false
  const pushGlob = () => {
    if (isGlobbing) {
      globs.push(isGlobbing.match.join('/'))
      isGlobbing = false
    }
  }
  const pushParam = (match: string) => {
    if (match!.includes('/')) return true
    assert(isParam)
    routeParams[isParam] = match!
    isParam = false
  }

  for (const routeIndex in routeSegments) {
    const routeSegment = routeSegments[routeIndex]!
    /*
    console.log('routeSegment', routeSegment)
    console.log('urlRest', urlRest)
    */
    if (routeSegment.static) {
      const { s } = routeSegment
      if (!isGlobbing && !isParam) {
        if (!urlRest.startsWith(s)) return null
        urlRest = urlRest.slice(s.length)
      } else {
        if (!urlRest.includes(s)) return null
        const [match, ...rest] = urlRest.split(s)
        if (isParam) {
          const failed = pushParam(match!)
          if (failed) return null
        }
        if (isGlobbing) {
          isGlobbing.match.push(match!)
          pushGlob()
        }
        urlRest = rest.join(s)
      }
    } else if (routeSegment.param) {
      isParam = routeSegment.s
    } else {
      assert(routeSegment.glob)
      pushGlob()
      isGlobbing = { match: [] }
      // TODO: remove
      if (routeIndex === String(routeSegments.length - 1)) {
        isGlobbing.isTrailingGlob = true
      }
    }
  }

  if (urlRest && !isGlobbing && !isParam) {
    return null
  }
  if (isParam) {
    if (!urlRest) return null
    if (urlRest.endsWith('/') && urlRest !== '/') urlRest = urlRest.slice(0, -1)
    const failed = pushParam(urlRest)
    if (failed) return null
  }
  if (isGlobbing) {
    isGlobbing.match.push(urlRest)
    pushGlob()
  }

  globs.forEach((val, i) => {
    const idx = `*${globs.length !== 1 ? i + 1 : ''}` as const
    routeParams[idx] = val
  })

  return { routeParams }
}
// TODO: simplify
type Segment =
  | {
      glob: true
      static?: undefined
      param?: undefined
    }
  | {
      glob?: undefined
      static: true
      param?: undefined
      s: string
    }
  | {
      glob?: undefined
      static?: undefined
      param: true
      s: string
    }
function splitRouteString(routeString: string) {
  const segments: Segment[] = []
  const parts = routeString.split('/')
  parts.forEach((s, i) => {
    if (isParam(s)) {
      assertWarning(
        !s.startsWith(PARAM_TOKEN_OLD),
        `Outdated Route String ${pc.cyan(routeString)}, use ${pc.cyan(
          routeString.split(PARAM_TOKEN_OLD).join(PARAM_TOKEN_NEW)
        )} instead.`,
        { onlyOnce: true }
      )
      segments.push({ param: true, s: s.slice(1) })
    } else {
      // TODO: simplify?
      if (i !== parts.length - 1) s += '/'
      if (segments[segments.length - 1]?.param) s = '/' + s
      const parts2 = s.split('*')
      parts2.forEach((s, i) => {
        if (i !== 0) segments.push({ glob: true })
        if (s !== '') {
          const segmentLast = segments[segments.length - 1]
          if (segmentLast?.static) {
            segmentLast.s += s
          } else {
            segments.push({ static: true, s })
          }
        }
      })
    }
  })
  return segments
}

function resolveRouteStringOld(
  routeString: string,
  urlPathname: string
): null | { routeParams: Record<string, string> } {
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
        `Outdated Route String ${pc.cyan(routeString)}, use ${pc.cyan(
          routeString.split(PARAM_TOKEN_OLD).join(PARAM_TOKEN_NEW)
        )} instead.`,
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
    )}: Route Strings aren't allowed to contain more than one glob ${highlight('*')} (use a Route Function instead)`
  )
  assertUsage(
    numberOfGlobChars === 0 || (numberOfGlobChars === 1 && routeString.endsWith('*')),
    `Invalid Route String ${highlight(routeString)}: make sure it ends with ${highlight('*')} or use a Route Function`
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
    return pc.cyan(routeString)
  }
}
