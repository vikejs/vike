export type { PageContextBuiltIn } from '../shared/types.js'
export type { PageContextBuiltInClientWithClientRouting } from '../shared/types.js'
export type { PageContextBuiltInClientWithServerRouting } from '../shared/types.js'
export type { InjectFilterEntry } from '../node/runtime/html/injectAssets/getHtmlTags.js'
export type { Config, Meta, Effect } from '../shared/page-configs/Config.js'
export type { ConfigEnvPublic as Env } from '../shared/page-configs/PageConfig.js'
export type { ConfigEntries } from '../shared/getPageFiles/getExports.js'

// TODO/v1-release: remove
// Ancient VPS versions used to have `import type { PageContextBuiltInClient } from 'vite-plugin-ssr/types'`
import { PageContextBuiltInClientWithServerRouting } from '../shared/types.js'
/** @deprecated Replace:
 *   `import { PageContextBuiltInClient } from 'vite-plugin-ssr/types'`
 * With:
 *   `import { PageContextBuiltInClientWithServerRouting } from 'vite-plugin-ssr/types'`
 * Or:
 *   `import { PageContextBuiltInClientWithClientRouting } from 'vite-plugin-ssr/types'`
 */
type PageContextBuiltInClient<Page = any> = PageContextBuiltInClientWithServerRouting<Page>
export type { PageContextBuiltInClient }
