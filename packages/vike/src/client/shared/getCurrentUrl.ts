import '../assertEnvClient.js'

export { getCurrentUrl }

import { normalizeClientSideUrl } from './normalizeClientSideUrl.js'

function getCurrentUrl(options?: { withoutHash: true }): `/${string}` {
  return normalizeClientSideUrl(window.location.href, options)
}
