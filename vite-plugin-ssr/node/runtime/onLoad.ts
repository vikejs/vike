export { onLoad }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser'
import { assertNodeVersion } from '../../utils/assertNodeVersion'
import { installRequireShim } from '@brillout/require-shim'

function onLoad() {
  assertIsNotBrowser()
  assertNodeVersion()
  installRequireShim()
}
