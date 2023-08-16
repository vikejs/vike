// TODO/v1-release - move:
//   import { navigate, prefetch } from 'vite-plugin-ssr/client/router'
// to:
//   import { navigate, prefetch } from 'vite-plugin-ssr'
// Use package.json#exports to make the imports isomorphic.

export { navigate, reload } from './navigate.js'
export { prefetch } from './prefetch.js'

// TODO/v1-release: remove this
import type { PageContextBuiltInClientWithClientRouting } from '../../shared/types.js'
/** @deprecated
 * Replace:
 *   ```
 *   import type { PageContextBuiltInClient } from 'vite-plugin/client/router'
 *   ```
 * With:
 *   ```
 *   import type {
 *     PageContextBuiltInClientWithClientRouting as
 *     PageContextBuiltInClient
 *   } from 'vite-plugin-ssr/types'
 *   ```
 */
type PageContextBuiltInClient<Page = any> = PageContextBuiltInClientWithClientRouting<Page>
export type { PageContextBuiltInClient }
