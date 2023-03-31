export type { PageContextBuiltIn } from '../shared/types'
export type { PageContextBuiltInClientWithClientRouting } from '../shared/types'
export type { PageContextBuiltInClientWithServerRouting } from '../shared/types'
export type { InjectFilterEntry } from '../node/runtime/html/injectAssets/getHtmlTags'
export type { Config } from '../shared/page-configs/Config'
export type { ConfigEnv as Env } from '../shared/page-configs/PageConfig'
export type { ConfigEntries } from '../shared/getPageFiles/getExports'

// TODO/v1-release: remove
// Ancient VPS versions used to have `import type { PageContextBuiltInClient } from 'vite-plugin-ssr/types'`
import { PageContextBuiltInClientWithServerRouting } from '../shared/types'
/** @deprecated Replace:
 *   `import { PageContextBuiltInClient } from 'vite-plugin-ssr/types'`
 * With:
 *   `import { PageContextBuiltInClientWithServerRouting } from 'vite-plugin-ssr/types'`
 * Or:
 *   `import { PageContextBuiltInClientWithClientRouting } from 'vite-plugin-ssr/types'`
 */
type PageContextBuiltInClient = PageContextBuiltInClientWithServerRouting
export type { PageContextBuiltInClient }
