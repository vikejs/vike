// TODO/v1-release - move:
//   import { navigate, prefetch } from 'vite-plugin-ssr/client/router'
// to:
//   import { navigate, prefetch } from 'vite-plugin-ssr'
// Use dependency injection to make the imports isomorphic.

export { navigate } from './navigate'
export { prefetch } from './prefetch'

// TODO/v1-release: remove this
import type { PageContextBuiltInClientWithClientRouting } from '../../shared/types'
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
