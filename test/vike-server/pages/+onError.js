// https://vike.dev/onError
export { onError }

/**
 * Global hook called when an error occurs anywhere in the application.
 * This is useful for error tracking, logging, or sending errors to services like Sentry.
 * 
 * @param {Object} pageContext - The page context object
 * @param {Error} pageContext.errorWhileRendering - The error that occurred
 */
function onError(pageContext) {
  // Example: Log the error to console
  console.error('Global onError hook - Error occurred:', {
    error: pageContext.errorWhileRendering,
    message: pageContext.errorWhileRendering?.message,
    stack: pageContext.errorWhileRendering?.stack,
    url: pageContext.urlOriginal,
    timestamp: new Date().toISOString()
  })

  // Example: Send error to external service (like Sentry)
  // Sentry.captureException(pageContext.errorWhileRendering, {
  //   tags: {
  //     url: pageContext.urlOriginal,
  //     timestamp: Date.now()
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
