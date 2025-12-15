export { onCreateGlobalContext }

import type { GlobalContextServer } from 'vike/types'

function onCreateGlobalContext(globalContext: GlobalContextServer) {
  ;(globalContext as any).importArrayServer1 = 'from-server-1'
}
