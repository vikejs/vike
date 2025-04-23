export { getGlobalContextClientInternal }
export type { GlobalContextClientWithServerRouting }

import { createGetGlobalContextClient } from '../shared/createGetGlobalContextClient.js'
import type { GlobalContextSharedPublic } from '../../shared/createGlobalContextShared.js'
// @ts-ignore
import * as virtualFileExports from 'virtual:vike:importUserCode:client:server-routing'

// Public type
type GlobalContextClientWithServerRouting = GlobalContextSharedPublic &
  Pick<GlobalContextClientInternal, 'isClientSide'> &
  Vike.GlobalContext &
  Vike.GlobalContextClient & {
    // Nothing extra for now
  }
type GlobalContextClientInternal = Awaited<ReturnType<typeof getGlobalContextClientInternal>>

const getGlobalContextClientInternal = createGetGlobalContextClient(virtualFileExports, false)
