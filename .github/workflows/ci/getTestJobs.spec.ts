import { getTestJobs } from './getTestJobs.mjs'
import { expect, describe, it } from 'vitest'

//*/
// We only use this `getTestJobs()` test for developing the getTestJobs() function. (Because, otherwise, the fixture down below would need to be updated everytime there is a new/(re)moved test file.)
const SKIP = true
/*/
const SKIP = false
//*/

describe('getTestJobs()', () => {
  if (SKIP) {
    const msg = 'SKIPPED getTestJobs() test'
    it(msg, () => {})
    return
  }

  it('basics', async () => {
    const jobs = await getTestJobs()
    expect(jobs).toMatchInlineSnapshot(`
      Redacted. Update this snapshot before using this test file.
    `)
  })
})
