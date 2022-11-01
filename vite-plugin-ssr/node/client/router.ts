export { navigate }

import { assertWarning } from '../../utils/assert'

function navigate() {
  assertWarning(false, 'Calling navigate() on the server-side has no effect', {
    showStackTrace: true,
    onlyOnce: false
  })
}
