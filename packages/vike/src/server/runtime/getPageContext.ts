export { getPageContext }
export { providePageContext }
export type { GetPageContextParams }

import {
  getPageContext_withAsyncHook,
  getPageContextProvided_withAsyncHook,
  providePageContext_withAsyncHook,
} from './asyncHook.js'
import {
  getPageContext_sync,
  providePageContext as providePageContext_sync,
} from '../../shared-server-client/hooks/execHook.js'
import type { PageContextClient, PageContextServer } from '../../types/PageContext.js'
import '../assertEnvServer.js'
import { assertWarning } from '../../utils/assert.js'
import pc from '@brillout/picocolors'

type GetPageContextParams = Parameters<typeof getPageContext>[0]
/**
 * Access `pageContext` object inside Vike hooks, in order to create universal hooks.
 *
 * https://vike.dev/getPageContext
 */
function getPageContext<PageContext = PageContextClient | PageContextServer>({
  asyncHook,
}: { asyncHook?: boolean } = {}): null | PageContext {
  assertWarning(
    !asyncHook,
    `${pc.cyan('getPageContext({ asyncHook: true })')} is discouraged, see https://vike.dev/getPageContext`,
    { onlyOnce: true },
  )

  {
    const pageContext = getPageContext_sync()
    if (pageContext) return pageContext as any
  }

  {
    const pageContext = getPageContextProvided_withAsyncHook()
    if (pageContext) return pageContext as any
  }

  if (asyncHook) {
    const pageContext = getPageContext_withAsyncHook()
    if (pageContext) return pageContext as any
  }

  return null
}

/**
 * Provide `pageContext` for universal hooks.
 *
 * https://vike.dev/getPageContext
 */
function providePageContext(pageContext: null | PageContextClient | PageContextServer) {
  // The request's AsyncLocalStorage store => code of another HTTP request never reads this `pageContext`
  const isProvided = providePageContext_withAsyncHook(pageContext)
  // No store, e.g. Cloudflare without `nodejs_compat`
  if (!isProvided) providePageContext_sync(pageContext)
}
