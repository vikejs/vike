export { onLoad }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.mjs'

function onLoad() {
  assertIsNotBrowser()
}
