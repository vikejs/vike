export { resolveRouteString }
export { getUrlFromRouteString }
export { isStaticRouteString }
export { analyzeRouteString }
export { assertRouteString }
export { getRouteStringParameterList }

import { assertWarning, isBrowser, escapeRegex } from '../utils.js'
import { assert, assertUsage } from './utils.js'
import pc from '@brillout/picocolors'

const PARAM_TOKEN_NEW = '@'
// TODO/v1-release: remove
const PARAM_TOKEN_OLD = ':'

function assertRouteString(routeString: string, errPrefix: `${string}Invalid` | `${string}invalid` = 'Invalid') {
  let errPrefix2 = `${errPrefix} Route String ${highlight(routeString)}` as const
  assertUsage(routeString !== '', `${errPrefix2} (empty string): set it to ${highlight('/')} instead`)
  assertUsage(
    ['/', '*'].includes(routeString[0]!),
    `${errPrefix2}: it should start with ${highlight('/')} or ${highlight('*')}`,
  )
  assertUsage(
    !routeString.includes('**'),
    `${errPrefix2}: set it to ${highlight(routeString.split('**').join('*'))} instead`,
  )
}

function resolveRouteString(routeString: string, urlPathname: string): null | { routeParams: Record<string, string> } {
  assertRouteString(routeString)

  const segments = parseRouteString(routeString)
  const routeRegexStrInner: string = segments
    .map((segment) => {
      if (segment.param) {
        return '[^/]+'
      }
      if (segment.glob) {
        return '.*'
      }
      // segment.static
      return escapeRegex(segment.static!)
    })
    .map((s) => `(${s})`)
    .join('')
  const routeRegex = new RegExp(`^${routeRegexStrInner}/?$`)
  const routeRegexMatch = urlPathname.match(routeRegex)

  /* DEBUG
  console.log()
  console.log('routeString', routeString)
  console.log('urlPathname', urlPathname)
  console.log('routeSegments', segments)
  console.log('routeRegex', routeRegex)
  console.log('routeRegexMatch', routeRegexMatch)
  //*/

  if (!routeRegexMatch) return null

  const routeParams: Record<string, string> = {}
  const [_, ...segmentsValue] = routeRegexMatch
  let globIdx = 0
  const hasMultipleGlobs = segments.filter((segment) => segment.glob).length > 1
  segments.forEach((segment, i) => {
    let val = segmentsValue[i]!
    if (segment.param) {
      routeParams[segment.param] = val
    }
    if (segment.glob) {
      const param = `*${hasMultipleGlobs ? ++globIdx : ''}` as const
      routeParams[param] = val
    }
  })
  return { routeParams }
}
type Segment =
  | {
      glob: true
      static?: undefined
      param?: undefined
    }
  | {
      glob?: undefined
      static: string
      param?: undefined
    }
  | {
      glob?: undefined
      static?: undefined
      param: string
    }
function parseRouteString(routeString: string) {
  const segments: Segment[] = []
  const pushStatic = (s: string) => {
    const segmentLast = segments[segments.length - 1]
    if (segmentLast?.static) {
      segmentLast.static += s
    } else {
      segments.push({ static: s })
    }
  }
  const parts = routeString.split('/')
  parts.forEach((s, i) => {
    if (i !== 0) pushStatic('/')
    if (isParam(s)) {
      assertWarning(
        !s.startsWith(PARAM_TOKEN_OLD),
        `Outdated Route String ${highlight(routeString)}, use ${highlight(
          routeString.split(PARAM_TOKEN_OLD).join(PARAM_TOKEN_NEW),
        )} instead`,
        { onlyOnce: true },
      )
      segments.push({ param: s.slice(1) })
    } else {
      if (s === '*' && i === parts.length - 1 && routeString !== '*' && routeString !== '/*') {
        segments.push({ glob: true })
      } else {
        s.split('*').forEach((s, i) => {
          if (i !== 0) segments.push({ glob: true })
          if (s !== '') {
            pushStatic(s)
          }
        })
      }
    }
  })
  return segments
}

function getRouteStringParameterList(routeString: string): string[] {
  const routeParameterList: string[] = []
  const segments = parseRouteString(routeString)
  segments.forEach((segment) => {
    if (segment.param) routeParameterList.push(segment.param)
  })
  return routeParameterList
}

function getUrlFromRouteString(routeString: string): null | string {
  if (isStaticRouteString(routeString)) {
    const url = routeString
    return url
  }
  return null
}

function analyzeRouteString(routeString: string) {
  const segments = parseRouteString(routeString)

  const countStaticParts = (s: string | undefined): number => s?.split('/').filter(Boolean).length || 0

  let numberOfStaticPartsBeginning = 0
  for (const segment of segments) {
    if (!segment.static) break
    numberOfStaticPartsBeginning += countStaticParts(segment.static)
  }

  const numberOfStaticParts = segments.map((s) => countStaticParts(s.static)).reduce((sum, a) => sum + a, 0)
  const numberOfParams = segments.filter((s) => s.param).length
  const numberOfGlobs = segments.filter((s) => s.glob).length

  return { numberOfStaticPartsBeginning, numberOfStaticParts, numberOfParams, numberOfGlobs }
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
