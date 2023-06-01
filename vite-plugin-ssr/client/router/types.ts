// TODO/v1-release: remove this file
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
