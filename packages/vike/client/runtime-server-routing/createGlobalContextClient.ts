export { createGlobalContextClient }
export type { GlobalContextClientWithServerRouting }
export type { GlobalContextClientInternalWithServerRouting }

import { createGetGlobalContextClient } from '../shared/createGetGlobalContextClient.js'
import type { GlobalContextBasePublic } from '../../shared/createGlobalContextShared.js'

// Public type
type GlobalContextClientWithServerRouting = GlobalContextBasePublic &
  Pick<GlobalContextClientInternalWithServerRouting, 'isClientSide'> &
  Vike.GlobalContext &
  Vike.GlobalContextClient & {
    // Nothing extra for now
  }
type GlobalContextClientInternalWithServerRouting = Awaited<ReturnType<typeof createGlobalContextClient>>

// TODO/now: remove this useless function and re-export instead?
async function createGlobalContextClient() {
  const globalContext = await createGetGlobalContextClient()
  return globalContext
}
