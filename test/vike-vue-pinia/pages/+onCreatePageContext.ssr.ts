// Test file for .ssr.ts suffix
// This file should be bundled on the server-side but should NOT run during pageContext.json requests

export { onCreatePageContext }

import type { PageContextServer } from 'vike/types'

function onCreatePageContext(pageContext: PageContextServer) {
  // This is only for SSR initialization (e.g., Pinia store initialization)
  // It does NOT run during client-side navigation (pageContext.json requests)
  console.log('[SSR-only] onCreatePageContext called')
  pageContext.ssrOnlyFlag = true
}

declare global {
  namespace Vike {
    interface PageContext {
      ssrOnlyFlag?: boolean
    }
  }
}
