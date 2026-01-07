import '../assertEnvClient.js'

export { getBaseServer }

import { assert } from '../../utils/assert.js'

function getBaseServer(): string {
  const baseServer = import.meta.env.BASE_SERVER
  assert(isBaseServer(baseServer))
  return baseServer
}
// We don't use isBaseServer() defined in utils/parseUrl.ts to avoid loading the whole file in the browser
function isBaseServer(baseServer: string): boolean {
  return baseServer.startsWith('/')
}
