export { navigate }

import { assertWarning } from '../../utils/assert'
import type { navigate as navigateOriginal } from '../../client/router/navigate'

const navigate = (() => {
  assertWarning(false, 'Calling navigate() on the server-side has no effect', {
    showStackTrace: true,
    onlyOnce: false
  })
}) as any as typeof navigateOriginal
