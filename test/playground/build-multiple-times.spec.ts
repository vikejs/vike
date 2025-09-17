import { describe, it } from 'vitest'
import { build } from 'vike/api'

describe('build multiple times', () => {
  it('works', { timeout: 20 * 1000 }, async () => {
    await build()
    await build()
    await build()
    await build()
  })
})
