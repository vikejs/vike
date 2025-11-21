export { guard }

// TODO:
// - Move to pages/guard-client-only/
// - Simply always `throw render()` here and test whehter it works both client-side nav and first-page visist. Use a proper @brillout/e2e test for this.

import type { PageContextClient } from 'vike/types'

async function guard(pageContext: PageContextClient) {
  console.log('Client-side guard executed')

  // Store execution info in global object for testing
  if (typeof window !== 'undefined') {
    ;(window as any).__GUARD_CLIENT_EXECUTED__ = true
    ;(window as any).__GUARD_CLIENT_TIMESTAMP__ = Date.now()
  }
}
