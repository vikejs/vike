export { guard }

import type { PageContextClient } from 'vike/types'

async function guard(pageContext: PageContextClient) {
  console.log('Client-side guard executed')

  // Add a marker to pageContext to track guard execution
  ;(pageContext as any).guardExecuted = true
  ;(pageContext as any).guardExecutedOn = typeof window !== 'undefined' ? 'client' : 'server'

  // Store in global object for testing
  if (typeof window !== 'undefined') {
    ;(window as any).__GUARD_EXECUTED__ = true
    ;(window as any).__GUARD_EXECUTED_ON__ = 'client'
  }
}
