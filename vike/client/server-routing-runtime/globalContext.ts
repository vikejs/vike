export { getGlobalContext }
export type { GlobalContextClientWithServerRouting }

import { createGetGlobalContext } from '../shared/createGetGlobalContext.js'
import type { GlobalContextSharedPublic } from '../../shared/createGlobalContextShared.js'
// @ts-ignore
import * as virtualFileExports from 'virtual:vike:importUserCode:client:server-routing'

// Public type
type GlobalContextClientWithServerRouting = GlobalContextSharedPublic &
  Vike.GlobalContext &
  Vike.GlobalContextClient & {
    // Nothing extra for now
  }

type GlobalContextClientWithServerRoutingInternal = Awaited<ReturnType<typeof getGlobalContext>>
const getGlobalContext = createGetGlobalContext(virtualFileExports, false)
