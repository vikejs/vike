// TODO/v1-release: remove this file
import type { PageContextBuiltInClientWithServerRouting } from '../shared/types'
/** @deprecated
 * Replace:
 *   ```
 *   import type { PageContextBuiltInClient } from 'vite-plugin/client'
 *   ```
 * With:
 *   ```
 *   import type {
 *     PageContextBuiltInClientWithServerRouting as
 *     PageContextBuiltInClient
 *   } from 'vite-plugin-ssr/types'
 *   ```
 */
type PageContextBuiltInClient = PageContextBuiltInClientWithServerRouting
export type { PageContextBuiltInClient }
