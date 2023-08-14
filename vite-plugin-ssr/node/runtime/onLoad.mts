export { onLoad }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.mjs'
import { assertNodeVersion } from '../../utils/assertNodeVersion.mjs'
import { installRequireShim } from '@brillout/require-shim'

function onLoad() {
  assertIsNotBrowser()
  assertNodeVersion()
  installRequireShim()
}
