import '../assertEnvClient.js'

export { logErrorClient }

import { isObject } from '../../utils/isObject.js'

function logErrorClient(err: unknown) {
  if (
    isObject(err) &&
    // Set by vike-react
    // https://github.com/vikejs/vike-react/blob/195a208c6b77e7f34496e1f637278a36c60fbe07/packages/vike-react/src/integration/onRenderClient.tsx#L109
    err.isAlreadyLogged
  ) {
    return
  }
  console.error(err)
}
