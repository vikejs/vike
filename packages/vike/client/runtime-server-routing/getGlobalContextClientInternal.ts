export { getGlobalContextClientInternal }
export type { GlobalContextClientWithServerRouting }
export type { GlobalContextClientInternalWithServerRouting }

import { getGlobalContextClientInternalShared } from '../shared/getGlobalContextClientInternalShared.js'
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
  const globalContext = await getGlobalContextClientInternalShared()
  return globalContext
}
