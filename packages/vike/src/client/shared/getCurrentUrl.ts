export { getCurrentUrl }

import { normalizeClientSideUrl } from './normalizeClientSideUrl.js'
import '../assertEnvClient.js'

function getCurrentUrl(options?: { withoutHash: true }): `/${string}` {
  return normalizeClientSideUrl(window.location.href, options)
}
