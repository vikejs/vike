export { onLoad }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.js'

function onLoad() {
  assertIsNotBrowser()
}
