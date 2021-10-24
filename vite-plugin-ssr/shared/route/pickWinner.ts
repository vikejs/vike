import { assert, higherFirst } from '../utils'

export { pickWinner }

function pickWinner<T extends { matchValue: boolean | number }>(routeResults: T[]): T | undefined {
  const candidates = routeResults
    .filter(({ matchValue }) => matchValue !== false)
    .sort(
      higherFirst(({ matchValue }) => {
        assert(matchValue !== false)
        return matchValue === true ? 0 : matchValue
      })
    )

  const winner = candidates[0]

  return winner
}
