export { onLoad }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.js'
import { assertNodeVersion } from '../../utils/assertNodeVersion.js'
import { installRequireShim } from '@brillout/require-shim'

function onLoad() {
  assertIsNotBrowser()
  assertNodeVersion()
  installRequireShim()
}
