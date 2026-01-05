import '../../../../assertEnvServer.js'

export { sanitizeJson }

/** Prevent XSS attacks, see https://github.com/vikejs/vike/pull/181#issuecomment-952846026 */
function sanitizeJson(unsafe: string): string {
  const safe = unsafe.replace(/</g, '\\u003c')
  return safe
}
