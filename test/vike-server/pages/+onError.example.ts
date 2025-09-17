// Example of a production-ready global onError hook
// https://vike.dev/onError

export { onError }

import type { PageContextServer } from 'vike/types'

/**
 * Global onError hook - called for all server-side errors in the application.
 * This includes:
 * - Page rendering errors
 * - Data fetching errors  
 * - Hook execution errors
 * - Global context initialization errors
 * - Configuration loading errors
 */
function onError(pageContext: PageContextServer & { errorWhileRendering: Error }) {
  const { errorWhileRendering, urlOriginal } = pageContext
  
  // 1. Log to console (always useful for debugging)
  console.error('Application Error:', {
    message: errorWhileRendering.message,
    stack: errorWhileRendering.stack,
    url: urlOriginal,
    timestamp: new Date().toISOString(),
    userAgent: pageContext.headers?.['user-agent'],
  })

  // 2. Send to error tracking service (e.g., Sentry)
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    // Example with Sentry
    // import * as Sentry from '@sentry/node'
    // Sentry.captureException(errorWhileRendering, {
    //   tags: {
    //     url: urlOriginal,
    //     component: 'server-side-rendering'
    //   },
    //   extra: {
    //     userAgent: pageContext.headers?.['user-agent'],
    //     timestamp: Date.now()
    //   }
    // })
  }

  // 3. Send to custom logging service
  // sendToLoggingService({
  //   level: 'error',
  //   message: errorWhileRendering.message,
  //   stack: errorWhileRendering.stack,
  //   metadata: {
  //     url: urlOriginal,
  //     userAgent: pageContext.headers?.['user-agent'],
  //     timestamp: Date.now()
  //   }
  // })

  // 4. Send metrics/alerts for critical errors
  // if (isCriticalError(errorWhileRendering)) {
  //   sendAlert({
  //     type: 'critical_error',
  //     error: errorWhileRendering.message,
  //     url: urlOriginal
  //   })
  // }
}

// Helper function to determine if an error is critical
// function isCriticalError(error: Error): boolean {
//   return error.message.includes('Database') || 
//          error.message.includes('Authentication') ||
//          error.message.includes('Payment')
// }
