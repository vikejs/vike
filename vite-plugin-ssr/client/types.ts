// TODO/v1-release: remove this file
import type { PageContextBuiltInClientWithServerRouting } from '../shared/types'
/** @deprecated
 * Replace:
 *   ```
 *   import type { PageContextBuiltIntClient } from 'vite-plugin/client'
 *   ```
 * With:
 *   ```
 *   import type {
 *     PageContextBuiltIntClientWithServerRouting as
 *     PageContextBuiltIntClient
 *   } from 'vite-plugin-ssr/types'
 *   ```
 */
type PageContextBuiltInClient = PageContextBuiltInClientWithServerRouting
export type { PageContextBuiltInClient }
