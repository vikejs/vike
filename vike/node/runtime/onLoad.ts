export { onLoad }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.js'
import { assertNodeVersion } from '../../utils/assertNodeVersion.js'
import { installRequireShim } from '@brillout/require-shim'
import { setAlwaysShowStackTrace } from './utils.js'
import { isErrorDebug } from '../shared/isErrorDebug.js'

function onLoad() {
  assertIsNotBrowser()
  assertNodeVersion()
  installRequireShim()
  if (isErrorDebug()) setAlwaysShowStackTrace()
}
