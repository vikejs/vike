export { testRun }

import { testRun as testRunClassic } from '../../examples/react-v1/.testRun'

type Cmd = Parameters<typeof testRunClassic>[0]
function testRun(cmd: Cmd) {
  testRunClassic(cmd, { isCJS: true })
}
