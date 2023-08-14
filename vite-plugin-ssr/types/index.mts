export type { PageContextBuiltIn } from '../shared/types.mjs'
export type { PageContextBuiltInClientWithClientRouting } from '../shared/types.mjs'
export type { PageContextBuiltInClientWithServerRouting } from '../shared/types.mjs'
export type { InjectFilterEntry } from '../node/runtime/html/injectAssets/getHtmlTags.mjs'
export type { Config, Meta, Effect } from '../shared/page-configs/Config.mjs'
export type { ConfigEnvPublic as Env } from '../shared/page-configs/PageConfig.mjs'
export type { ConfigEntries } from '../shared/getPageFiles/getExports.mjs'

// TODO/v1-release: remove
// Ancient VPS versions used to have `import type { PageContextBuiltInClient } from 'vite-plugin-ssr/types'`
import { PageContextBuiltInClientWithServerRouting } from '../shared/types.mjs'
/** @deprecated Replace:
 *   `import { PageContextBuiltInClient } from 'vite-plugin-ssr/types'`
 * With:
 *   `import { PageContextBuiltInClientWithServerRouting } from 'vite-plugin-ssr/types'`
 * Or:
 *   `import { PageContextBuiltInClientWithClientRouting } from 'vite-plugin-ssr/types'`
 */
type PageContextBuiltInClient<Page = any> = PageContextBuiltInClientWithServerRouting<Page>
export type { PageContextBuiltInClient }
