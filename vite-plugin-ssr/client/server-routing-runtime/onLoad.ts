export { onLoad }

import { assertIsBrowser } from '../../utils/assertIsBrowser'

function onLoad() {
  assertIsBrowser()
}
