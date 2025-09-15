// TypeScript example of +onError hook
// https://vike.dev/onError
export { onError }

import type { PageContextServer } from 'vike/types'

/**
 * Hook called when an error occurs during rendering.
 * This is useful for error tracking, logging, or sending errors to services like Sentry.
 */
function onError(pageContext: PageContextServer & { errorWhileRendering: Error }) {
  const { errorWhileRendering, urlOriginal, headers } = pageContext

  // Example 1: Basic console logging
  console.error('Rendering error:', {
    message: errorWhileRendering.message,
    stack: errorWhileRendering.stack,
    url: urlOriginal,
    userAgent: headers?.['user-agent'],
    timestamp: new Date().toISOString()
  })

  // Example 2: Sentry integration
  // import * as Sentry from '@sentry/node'
  // Sentry.captureException(errorWhileRendering, {
  //   tags: {
  //     url: urlOriginal,
  //     component: 'ssr'
  //   },
  //   user: {
  //     ip_address: headers?.['x-forwarded-for'] || headers?.['x-real-ip']
  //   }
  // })

  // Example 3: Custom error tracking service
  // await fetch('https://api.example.com/errors', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     error: {
  //       message: errorWhileRendering.message,
  //       stack: errorWhileRendering.stack
  //     },
  //     context: {
  //       url: urlOriginal,
  //       userAgent: headers?.['user-agent'],
  //       timestamp: Date.now()
  //     }
  //   })
  // })

  // Example 4: Development vs Production handling
  // if (process.env.NODE_ENV === 'development') {
  //   // In development, log detailed error information
  //   console.group('🚨 Rendering Error')
  //   console.error('Error:', errorWhileRendering)
  //   console.log('URL:', urlOriginal)
  //   console.log('Headers:', headers)
  //   console.groupEnd()
  // } else {
  //   // In production, send to monitoring service
  //   sendToMonitoringService(errorWhileRendering, { url: urlOriginal })
  // }
}
