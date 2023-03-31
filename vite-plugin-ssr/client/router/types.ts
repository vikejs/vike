// TODO/v1-release: remove this file
import type { PageContextBuiltInClientWithClientRouting } from '../../shared/types/PageContextBuiltIn'
/** @deprecated
 * Replace:
 *   ```
 *   import type { PageContextBuiltIntClient } from 'vite-plugin/client/router'
 *   ```
 * With:
 *   ```
 *   import type {
 *     PageContextBuiltIntClientWithClientRouting as
 *     PageContextBuiltIntClient
 *   } from 'vite-plugin-ssr/types'
 *   ```
 */
type PageContextBuiltInClient = PageContextBuiltInClientWithClientRouting
export type { PageContextBuiltInClient }
