export type { PageContextBuiltInServer } from '../shared/types.js'
export type { PageContextBuiltInClientWithClientRouting } from '../shared/types.js'
export type { PageContextBuiltInClientWithServerRouting } from '../shared/types.js'
export type { InjectFilterEntry } from '../node/runtime/html/injectAssets/getHtmlTags.js'
export type { Config, Meta, Effect } from '../shared/page-configs/Config.js'
export type { ConfigEnv } from '../shared/page-configs/PageConfig.js'
export type { ConfigDefinition } from '../node/plugin/plugins/importUserCode/v1-design/getVikeConfig/configDefinitionsBuiltIn.js'
export type { ConfigEntries } from '../shared/getPageFiles/getExports.js'

// TODO/v1-release: remove
import type { ConfigEnv } from '../shared/page-configs/PageConfig.js'
/** @deprecated Replace:
 *   `import type { Env } from 'vite-plugin-ssr/types'`
 * With:
 *   `import type { ConfigEnv } from 'vite-plugin-ssr/types'`
 */
type Env = ConfigEnv
export type { Env }

// TODO/v1-release: remove
// Ancient VPS versions used to have `import type { PageContextBuiltInClient } from 'vite-plugin-ssr/types'`
import { PageContextBuiltInClientWithServerRouting } from '../shared/types.js'
/** @deprecated Replace:
 *   `import type { PageContextBuiltInClient } from 'vite-plugin-ssr/types'`
 * With:
 *   `import type { PageContextBuiltInClientWithServerRouting } from 'vite-plugin-ssr/types'`
 * Or:
 *   `import type { PageContextBuiltInClientWithClientRouting } from 'vite-plugin-ssr/types'`
 */
type PageContextBuiltInClient<Page = any> = PageContextBuiltInClientWithServerRouting<Page>
export type { PageContextBuiltInClient }

// TODO/v1-release: remove
import { PageContextBuiltInServer } from '../shared/types.js'
/** @deprecated Replace:
 *   `import type { PageContextBuiltIn } from 'vite-plugin-ssr/types'`
 * With:
 *   `import type { PageContextBuiltInServer } from 'vite-plugin-ssr/types'`
 */
type PageContextBuiltIn<Page = any> = PageContextBuiltInServer<Page>
export type { PageContextBuiltIn }
