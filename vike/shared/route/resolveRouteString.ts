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
  let errPrefix2 = `${errPrefix} Route String ${highlight(routeString)}` as const
  assertUsage(routeString !== '', `${errPrefix2} (empty string): set it to ${highlight('/')} instead`)
  assertUsage(
    ['/', '*'].includes(routeString[0]!),
    `${errPrefix2}: it should start with ${highlight('/')} or ${highlight('*')}`
  )
  assertUsage(
    !routeString.includes('**'),
    `${errPrefix2}: set it to ${highlight(routeString.split('**').join('*'))} instead`
  )
}

// TODO: precedence
function resolveRouteString(routeString: string, urlPathname: string): null | { routeParams: Record<string, string> } {
  assertRouteString(routeString)

  const segments = getRouteSegments(routeString)
  /*
  console.log()
  console.log('routeString', routeString)
  console.log('urlPathname', urlPathname)
  console.log('routeSegments', segments)
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
  const pushGlob = () => {
    assert(isGlobbing)
    globs.push(isGlobbing.match.join('/'))
    isGlobbing = false
  }

  for (const segmentIdx in segments) {
    const segment = segments[segmentIdx]!
    if (segment.static) {
      const { s } = segment
      if (!isGlobbing) {
        if (!urlRest.startsWith(s)) return null
        urlRest = urlRest.slice(s.length)
      } else {
        if (!urlRest.includes(s)) return null
        const [match, ...rest] = urlRest.split(s)
        isGlobbing.match.push(match!)
        pushGlob()
        // console.log('urlRest', urlRest)
        urlRest = rest.join(s)
        // console.log('urlRest', urlRest)
      }
    } else if (segment.param) {
      const [match, ...rest] = urlRest.split('/')
      if (!match) return null
      routeParams[segment.s] = match
      urlRest = rest.join('/')
      if (urlRest) urlRest = '/' + urlRest
    } else {
      assert(segment.glob)
      if (isGlobbing) {
        pushGlob()
      }
      isGlobbing = { match: [] }
      // TODO: remove
      if (segmentIdx === String(segments.length - 1)) {
        isGlobbing.isTrailingGlob = true
      }
    }
  }

  if (urlRest && !isGlobbing) {
    return null
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
function getRouteSegments(routeString: string) {
  const segments: Segment[] = []
  const parts = routeString.split('/')
  parts.forEach((s, i) => {
    const isNotLast = i !== parts.length - 1
    if (isParam(s)) {
      assertWarning(
        !s.startsWith(PARAM_TOKEN_OLD),
        `Outdated Route String ${highlight(routeString)}, use ${highlight(
          routeString.split(PARAM_TOKEN_OLD).join(PARAM_TOKEN_NEW)
        )} instead`,
        { onlyOnce: true }
      )
      segments.push({ param: true, s: s.slice(1) })
      if (isNotLast) segments.push({ static: true, s: '/' })
    } else {
      if (isNotLast) s += '/'
      s.split('*').forEach((s, i) => {
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

function getUrlFromRouteString(routeString: string): null | string {
  assert(routeString.startsWith('/'))
  if (isStaticRouteString(routeString)) {
    const url = routeString
    return url
  }
  return null
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
