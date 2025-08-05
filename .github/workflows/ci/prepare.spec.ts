import { prepare } from './prepare'
import { expect, describe, it } from 'vitest'

describe('prepare()', () => {
  it('fixture', async () => {
    const jobs = await prepare()
    expect(jobs).toMatchInlineSnapshot(`
      Redacted. Update this snapshot before using this test file.
    `)
  })
})
