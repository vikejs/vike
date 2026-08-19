export { getPageContextClient }
export { setPageContextClient }

// This module deliberately lives outside renderPageClient.ts: the browser entry of vike/getPageContext
// imports getPageContextClient(), and importing it from renderPageClient.ts would pull the whole Client
// Routing runtime (including shared-server-client/route/index.js and its module-level assertClientRouting())
// into every browser bundle that imports vike/getPageContext — including Server Routing apps, e.g. upon
// vike-react's onRenderClient() importing vike/getPageContext.
// https://github.com/vikejs/vike/issues/3471

import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { getPageContextPublicClient } from './getPageContextPublicClient.js'
import type { PageContextClient } from '../../types/PageContext.js'
import '../assertEnvClient.js'

const globalObject = getGlobalObject('getPageContextClient.ts', {
  currentPageContext: null as null | Record<string, unknown>,
})

/**
 * Get the `pageContext` object on the client-side.
 *
 * https://vike.dev/getPageContextClient
 */
function getPageContextClient(): PageContextClient | null {
  const pageContext = globalObject.currentPageContext
  if (!pageContext) return null
  return getPageContextPublicClient(pageContext as any) as any
}

function setPageContextClient(pageContext: Record<string, unknown>): void {
  globalObject.currentPageContext = pageContext
}
