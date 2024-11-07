export { onLoad }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser'
import { assertNodeVersion } from '../../utils/assertNodeVersion'
import { installRequireShim } from '@brillout/require-shim'
import { setAlwaysShowStackTrace } from './utils'
import { isErrorDebug } from '../shared/isErrorDebug'

function onLoad() {
  assertIsNotBrowser()
  assertNodeVersion()
  installRequireShim()
  if (isErrorDebug()) setAlwaysShowStackTrace()
}
