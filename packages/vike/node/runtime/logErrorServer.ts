export { logErrorServer }
export { tryExecOnErrorHook }

import pc from '@brillout/picocolors'
import { isCallable, isObject, getGlobalObject } from './utils.js'

// Track which errors have already had their onError hook executed
const globalObject = getGlobalObject('runtime/logErrorServer.ts', {
  onErrorHookExecuted: new WeakSet<object>(),
})

function logErrorServer(err: unknown) {
  if (
    isObject(err) &&
    // Set by react-streaming
    // https://github.com/brillout/react-streaming/blob/0f93e09059a5936a1fb581bc1ce0bce473e0d5e0/src/server/renderToStream/common.ts#L36
    isCallable(err.prettifyThisError)
  ) {
    err = err.prettifyThisError(err)
  }

  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  // - TO-DO/eventuually: is that still true? Let's eventually remove it and see if it crashes Cloudflare.
  const errStr = isObject(err) && 'stack' in err ? String(err.stack) : String(err)

  console.error(pc.red(errStr))

  // Try to execute +onError hook for all server-side errors
  // This covers errors that occur before global context is initialized
  tryExecOnErrorHook(err)
}

async function tryExecOnErrorHook(err: unknown) {
  try {
    // Skip if not an object (can't track in WeakSet)
    if (!isObject(err)) return

    // Skip if onError hook was already executed for this error
    if (globalObject.onErrorHookExecuted.has(err)) return

    // Mark as executed to prevent duplicates
    globalObject.onErrorHookExecuted.add(err)

    // Check if global context is available - if not, we can't execute hooks yet
    // This is expected for initialization errors and is acceptable
    const { getGlobalContextServerInternal } = await import('./globalContext.js')
    let globalContextResult
    try {
      globalContextResult = await getGlobalContextServerInternal()
    } catch {
      return // Global context not available yet - this is expected for initialization errors
    }

    const { globalContext } = globalContextResult
    if (!globalContext) return

    // Find an error page to use as context for the onError hook
    const { getErrorPageId } = await import('../../shared/error-page.js')
    const errorPageId = getErrorPageId(globalContext._pageFilesAll, globalContext._pageConfigs)

    if (!errorPageId) return // No error page defined, can't execute onError hook

    // We need to load the page configuration to execute hooks properly
    // This is a simplified approach that only works when global context is available
    const { loadPageConfigsLazyServerSide } = await import('./renderPage/loadPageConfigsLazyServerSide.js')
    const { createPageContextServerSide } = await import('./renderPage/createPageContextServerSide.js')

    // Create a basic page context for the error page
    const pageContextInit = {
      urlOriginal: '/_error', // Dummy URL for error page
      headersOriginal: null,
    }

    const pageContextCreated = createPageContextServerSide(pageContextInit, globalContext, {
      isPrerendering: false,
      ssr: { urlHandler: null, isClientSideNavigation: false },
    })

    // Set the error page ID and error
    Object.assign(pageContextCreated, {
      pageId: errorPageId,
      errorWhileRendering: err as unknown as Error,
      _httpRequestId: null,
      routeParams: {} as Record<string, string>, // Empty route params for error page
    })

    // Load page configurations for the error page
    const pageContextWithConfig = await loadPageConfigsLazyServerSide(pageContextCreated as any)

    // Execute the onError hook
    const { execHookServer } = await import('./renderPage/execHookServer.js')
    await execHookServer('onError', pageContextWithConfig)

  } catch (hookErr) {
    // If anything fails while trying to execute the onError hook, silently ignore
    // We don't want to create infinite loops or interfere with error page rendering
    // The original error logging has already happened
  }
}
