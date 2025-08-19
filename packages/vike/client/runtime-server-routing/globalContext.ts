export { getGlobalContextClientInternal }
export type { GlobalContextClientWithServerRouting }
export type { GlobalContextClientInternalWithServerRouting }

import { createGetGlobalContextClient } from '../shared/createGetGlobalContextClient.js'
import type { GlobalContextBasePublic } from '../../shared/createGlobalContextShared.js'
// @ts-ignore
import * as virtualFileExports from 'virtual:vike:global-entry:client:server-routing'

// Public type
type GlobalContextClientWithServerRouting = GlobalContextBasePublic &
  Pick<GlobalContextClientInternalWithServerRouting, 'isClientSide'> &
  Vike.GlobalContext &
  Vike.GlobalContextClient & {
    // Nothing extra for now
  }
type GlobalContextClientInternalWithServerRouting = Awaited<ReturnType<typeof getGlobalContextClientInternal>>

const getGlobalContextClientInternal = createGetGlobalContextClient(virtualFileExports, false)
