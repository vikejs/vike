import { assertUsage } from './utils'
assertUsage(
  false,
  'The module `vite-plugin-ssr` cannot be imported in the browser. Did you mean to import from `vite-plugin-ssr/client` or `vite-plugin-ssr/client/router` instead?',
)
