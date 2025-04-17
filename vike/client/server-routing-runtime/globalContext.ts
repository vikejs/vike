export { getGlobalContext }
export type { GlobalContextClientSidePublic }

import { createGetGlobalContext } from '../shared/createGetGlobalContext.js'
import type { GlobalContextSharedPublic } from '../../shared/createGlobalContextShared.js'
// @ts-ignore
import * as virtualFileExports from 'virtual:vike:importUserCode:client:server-routing'

type GlobalContextClientSidePublic = GlobalContextSharedPublic & {
  // Nothing extra for now
}

type GlobalContextClientSide = Awaited<ReturnType<typeof getGlobalContext>>
const getGlobalContext = createGetGlobalContext(virtualFileExports, false)
