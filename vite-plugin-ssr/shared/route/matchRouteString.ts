export { matchRouteString }
export { isParameterizedFilesystemRoute }

import { assertWarning } from '../utils'
import { assert, assertUsage } from './utils'

function matchRouteString(routeString: string, urlPathname: string): null | { routeParams: Record<string, string> } {
  assertUsage(
    routeString === '*' || routeString.startsWith('/'),
    `Invalid route string \`${routeString}\`: route strings should start with a leading slash \`/\`.`,
  )
  assert(urlPathname.startsWith('/'))

  const routeParts = routeString.split('/')
  const urlParts = urlPathname.split('/')

  const routeParams: Record<string, string> = {}

  assertGlob(routeString)

  if (routeString === '*') {
    routeString = '/*'
  }

  //console.log(routeString, urlPathname)
  for (let i = 0; i < Math.max(routeParts.length, urlParts.length); i++) {
    const routeDir = routeParts[i]
    const urlDir = urlParts[i]
    if (routeDir === '*') {
      routeParams['*'] = urlParts.slice(Math.max(1, i)).join('/')
      return { routeParams }
    } else if (routeDir?.startsWith(':') || routeDir?.startsWith('@')) {
      assertWarning(
        !routeDir.startsWith(':'),
        `Outdated route string \`${routeString}\`, use \`${routeString.split(':').join('@')}\` instead.`,
        { onlyOnce: true },
      )
      if (!urlDir) {
        return null
      }
      routeParams[routeDir.slice(1)] = urlDir
    } else {
      if ((routeDir || '') !== (urlDir || '')) {
        return null
      }
    }
  }

  return { routeParams }
}

function isParameterizedFilesystemRoute(filesystemRoute: string): boolean {
  return filesystemRoute.includes('@')
}

function assertGlob(routeString: string) {
  const numberOfGlobChars = routeString.split('*').length - 1
  assertUsage(
    numberOfGlobChars <= 1,
    `Invalid route string \`${routeString}\`: route strings are not allowed to contain more than one glob character \`*\`.`,
  )
  assertUsage(
    numberOfGlobChars === 0 || (numberOfGlobChars === 1 && routeString.endsWith('*')),
    `Invalid route string \`${routeString}\`: make sure your route string ends with the glob character \`*\`.`,
  )
}
