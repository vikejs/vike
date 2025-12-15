export { onCreateGlobalContext }

import type { GlobalContextClient } from 'vike/types'

function onCreateGlobalContext(globalContext: GlobalContextClient) {
  ;(globalContext as any).importArrayClient1 = 'from-client-1'
}
