export { testRun }

import { testRun as testRun_ } from '../../examples/react/.testRun'

type Cmd = Parameters<typeof testRun_>[0]
function testRun(cmd: Cmd) {
  testRun_(cmd, true)
}
