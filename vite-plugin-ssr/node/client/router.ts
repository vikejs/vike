export { navigate }

import { assertWarning } from '../../utils/assert'

const navigate = (() => {
  assertWarning(false, 'Calling navigate() on the server-side has no effect', {
    showStackTrace: true,
    onlyOnce: false
  })
  // `as never` because package.json#exports["./client/router"].types points to type defined by the client-side code
}) as never
