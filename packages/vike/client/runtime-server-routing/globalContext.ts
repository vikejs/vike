// TODO/now: rename file
// TODO/now: rename export
export { getGlobalContextClientInternal }
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
type GlobalContextClientInternalWithServerRouting = Awaited<ReturnType<typeof getGlobalContextClientInternal>>

// TODO/now: remove this useless function and re-export instead?
async function getGlobalContextClientInternal() {
  const globalContext = await createGetGlobalContextClient()
  return globalContext
}
