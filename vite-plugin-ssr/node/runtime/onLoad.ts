export { onLoad }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser'
import { assertNodeVersion } from '../../utils/assertNodeVersion'

function onLoad() {
  assertIsNotBrowser()
  assertNodeVersion()
}
