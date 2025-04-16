export { getGlobalContext }
export type { GlobalContextClientSidePublic }

import { createGetGlobalContext } from '../shared/createGetGlobalContext.js'
// @ts-ignore
import * as virtualFileExports from 'virtual:vike:importUserCode:client:server-routing'

type GlobalContextClientSidePublic = {
  // Nothing public for now
}
type GlobalContextClientSide = Awaited<ReturnType<typeof getGlobalContext>>

const getGlobalContext = createGetGlobalContext(virtualFileExports, false)
