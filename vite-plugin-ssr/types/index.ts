export type { PageContext } from '../shared/types.js'
export type { PageContextServer } from '../shared/types.js'
export type { PageContextClient } from '../shared/types.js'

// For users who don't use Client Routing
export type { PageContextWithServerRouting } from '../shared/types.js'
export type { PageContextClientWithServerRouting } from '../shared/types.js'

// Legacy way of enabling users to construct their own `PageContext` type.
//  - Should we (eventually) remove these from the public types? (While telling users to extend the Vike.PageContext interface instead.)
export type { PageContextBuiltInServer } from '../shared/types.js'
export type { PageContextBuiltInClientWithClientRouting } from '../shared/types.js'
export type { PageContextBuiltInClientWithServerRouting } from '../shared/types.js'

export type { Config, ConfigMeta as Meta } from '../shared/page-configs/Config.js'
export type { ConfigEnv } from '../shared/page-configs/PageConfig.js'
export type {
  ConfigDefinition,
  ConfigEffect
} from '../node/plugin/plugins/importUserCode/v1-design/getVikeConfig/configDefinitionsBuiltIn.js'
export type { ConfigEntries } from '../shared/getPageFiles/getExports.js'

export type { InjectFilterEntry } from '../node/runtime/html/injectAssets/getHtmlTags.js'

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
import type { ConfigEffect } from '../node/plugin/plugins/importUserCode/v1-design/getVikeConfig/configDefinitionsBuiltIn.js'
/** @deprecated Replace:
 *   `import type { Effect } from 'vite-plugin-ssr/types'`
 * With:
 *   `import type { ConfigEffect } from 'vite-plugin-ssr/types'`
 */
type Effect = ConfigEffect
export type { Effect }

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
