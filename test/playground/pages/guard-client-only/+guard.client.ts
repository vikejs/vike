export { guard }

import type { PageContextClient } from 'vike/types'
import { render } from 'vike/abort'

async function guard(pageContext: PageContextClient) {
  console.log('Client-side guard executed - always throwing render()')
  
  // Store execution info in global object for testing
  if (typeof window !== 'undefined') {
    ;(window as any).__GUARD_CLIENT_EXECUTED__ = true
    ;(window as any).__GUARD_CLIENT_TIMESTAMP__ = Date.now()
  }
  
  // Always throw render() to test that it works for both client-side nav and first-page visit
  throw render('/guard-client-only/success')
}
