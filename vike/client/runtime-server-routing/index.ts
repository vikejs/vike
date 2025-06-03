// TODO/v1-release: remove this file

import type { PageContextBuiltInClientWithServerRouting } from '../../shared/types.js'
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
 *   } from 'vike/types'
 *   ```
 */
type PageContextBuiltInClient<Page = any> = PageContextBuiltInClientWithServerRouting<Page>
export type { PageContextBuiltInClient }
