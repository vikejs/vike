import { makeFirst } from '../utils'
import { resolveRouteStringPrecedence, isStaticRoute } from './resolveRouteString'

export { pickWinner }
export type { RouteType }

type RouteType = 'STRING' | 'FUNCTION' | 'FILESYSTEM'
type RouteMatches = {
  precedence?: number | null
  routeString?: string
  routeType: RouteType
}
function pickWinner<T extends RouteMatches>(routeResults: T[]): T | undefined {
  // prettier-ignore
  const candidates = routeResults
    .sort(resolveRouteStringPrecedence)
    // See https://vite-plugin-ssr.com/route-function#precedence
    .sort(makeFirst((routeMatch) => routeMatch.routeType === 'FUNCTION' && !!routeMatch.precedence && routeMatch.precedence < 0))
    .sort(makeFirst((routeMatch) => routeMatch.routeType === 'STRING' && isStaticRoute(routeMatch.routeString!) === false))
    .sort(makeFirst((routeMatch) => routeMatch.routeType === 'FUNCTION' && !routeMatch.precedence))
    .sort(makeFirst((routeMatch) => routeMatch.routeType === 'STRING' && isStaticRoute(routeMatch.routeString!) === true))
    .sort(makeFirst((routeMatch) => routeMatch.routeType === 'FILESYSTEM'))
    .sort(makeFirst((routeMatch) => routeMatch.routeType === 'FUNCTION' && !!routeMatch.precedence && routeMatch.precedence > 0))

  const winner = candidates[0]

  return winner
}
