export { route as default }

// TEST: a Route Function for a page defined programmatically via `config.pages` (see /pages/+config.ts).
// It must be a pointer import (`with { type: 'vike:pointer' }`) so that Vike loads it at runtime.
function route(pageContext: { urlPathname: string }) {
  const prefix = '/programmatic-route-function/'
  if (!pageContext.urlPathname.startsWith(prefix)) return false
  return { routeParams: { name: pageContext.urlPathname.slice(prefix.length) } }
}
