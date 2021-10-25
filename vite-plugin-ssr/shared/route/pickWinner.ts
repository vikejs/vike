import { higherFirst } from '../utils'
import { resolveRouteStringPrecedence } from './resolveRouteString'

export { pickWinner }

function pickWinner<T extends { precedence: number | null; routeString: string | null }>(
  routeResults: T[]
): T | undefined {
  const candidates = routeResults
    .sort(
      higherFirst(({ precedence }) => {
        return precedence === null ? 0 : precedence
      })
    )
    .sort(resolveRouteStringPrecedence)

  const winner = candidates[0]

  return winner
}
