export { onLoad }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser'

function onLoad() {
  assertIsNotBrowser()
}
