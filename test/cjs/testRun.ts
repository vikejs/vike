export { testRun }

import { testRunClassic } from '../../test/utils'

type Cmd = Parameters<typeof testRunClassic>[0]
function testRun(cmd: Cmd) {
  testRunClassic(cmd)
}
