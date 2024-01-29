export { testRun }

import { testRun as testRunClassic } from '../../examples/react-minimal/.testRun'

type Cmd = Parameters<typeof testRunClassic>[0]
function testRun(cmd: Cmd) {
  testRunClassic(cmd, { isCJS: true })
}
