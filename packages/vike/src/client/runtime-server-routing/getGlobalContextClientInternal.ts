import '../assertEnvClient.js'

export { getGlobalContextClientInternal }
export type { GlobalContextClientInternalWithServerRouting }

import { getGlobalContextClientInternalShared } from '../shared/getGlobalContextClientInternalShared.js'

type GlobalContextClientInternalWithServerRouting = Awaited<ReturnType<typeof getGlobalContextClientInternal>>

async function getGlobalContextClientInternal() {
  const globalContext = await getGlobalContextClientInternalShared()
  return globalContext
}
