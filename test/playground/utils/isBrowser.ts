/** Returns whether this code is currently running within the browser or on the server.
 *
 * Used within the tests as a quick-and-dirty way of verifying that the code which
 * generated the response was actually executed on the server resp. on the client.
 */
export const isBrowser = typeof window === 'object'
