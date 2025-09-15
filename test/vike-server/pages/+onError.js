// https://vike.dev/onError
export { onError }

/**
 * Hook called when an error occurs during rendering.
 * This is useful for error tracking, logging, or sending errors to services like Sentry.
 * 
 * @param {Object} pageContext - The page context object
 * @param {Error} pageContext.errorWhileRendering - The error that occurred during rendering
 */
function onError(pageContext) {
  // Example: Log the error to console
  console.error('Error occurred during rendering:', {
    error: pageContext.errorWhileRendering,
    url: pageContext.urlOriginal,
    userAgent: pageContext.headers?.['user-agent'],
    timestamp: new Date().toISOString()
  })

  // Example: Send error to external service (like Sentry)
  // Sentry.captureException(pageContext.errorWhileRendering, {
  //   tags: {
  //     url: pageContext.urlOriginal,
  //     userAgent: pageContext.headers?.['user-agent']
  //   }
  // })

  // Example: Custom error tracking
  // trackError({
  //   error: pageContext.errorWhileRendering,
  //   context: {
  //     url: pageContext.urlOriginal,
  //     timestamp: Date.now()
  //   }
  // })
}
