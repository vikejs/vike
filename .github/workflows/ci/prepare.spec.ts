import { prepare } from './prepare'
import { expect, describe, it } from 'vitest'

//*/
// We only use this `prepare()` test for developing the prepare() function. (Because, otherwise, the fixture down below would need to be updated everytime there is a new/(re)moved test file.)
const SKIP = true
/*/
const SKIP = false
//*/

describe('prepare()', () => {
  if (SKIP) {
    const msg = 'SKIPPED prepare() test'
    it(msg, () => {})
    return
  }

  it('basics', async () => {
    const jobs = await prepare()
    expect(jobs).toMatchInlineSnapshot(`
      Redacted. Update this snapshot before using this test file.
    `)
  })
})
