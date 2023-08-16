// Same as ./index.ts but with deprecation notice.

// TODO/v1-release: remove this file

export type {
  PageContextBuiltIn,
  PageContextBuiltInClientWithClientRouting,
  PageContextBuiltInClientWithServerRouting,
  InjectFilterEntry,
  Config,
  Env,
  ConfigEntries
}
import type {
  PageContextBuiltIn as PageContextBuiltIn_,
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClientWithClientRouting_,
  PageContextBuiltInClientWithServerRouting as PageContextBuiltInClientWithServerRouting_,
  InjectFilterEntry as InjectFilterEntry_,
  Config as Config_,
  Env as Env_,
  ConfigEntries as ConfigEntries_
} from './index.js'

/** @deprecated All types have been moved to `vite-plugin-ssr/types`.
 * Replace:
 *   `import type { PageContextBuiltIn } from 'vite-plugin-ssr'`
 * With:
 *   `import type { PageContextBuiltIn } from 'vite-plugin-ssr/types'`
 */
type PageContextBuiltIn<Page = any> = PageContextBuiltIn_<Page>
/** @deprecated All types have been moved to `vite-plugin-ssr/types`.
 * Replace:
 *   `import type { PageContextBuiltInClientWithClientRouting } from 'vite-plugin-ssr'`
 * With:
 *   `import type { PageContextBuiltInClientWithClientRouting } from 'vite-plugin-ssr/types'`
 */
type PageContextBuiltInClientWithClientRouting<Page = any> = PageContextBuiltInClientWithClientRouting_<Page>
/** @deprecated All types have been moved to `vite-plugin-ssr/types`.
 * Replace:
 *   `import type { PageContextBuiltInClientWithServerRouting } from 'vite-plugin-ssr'`
 * With:
 *   `import type { PageContextBuiltInClientWithServerRouting } from 'vite-plugin-ssr/types'`
 */
type PageContextBuiltInClientWithServerRouting<Page = any> = PageContextBuiltInClientWithServerRouting_<Page>
/** @deprecated All types have been moved to `vite-plugin-ssr/types`.
 * Replace:
 *   `import type { InjectFilterEntry } from 'vite-plugin-ssr'`
 * With:
 *   `import type { InjectFilterEntry } from 'vite-plugin-ssr/types'`
 */
type InjectFilterEntry = InjectFilterEntry_
/** @deprecated All types have been moved to `vite-plugin-ssr/types`.
 * Replace:
 *   `import type { Config } from 'vite-plugin-ssr'`
 * With:
 *   `import type { Config } from 'vite-plugin-ssr/types'`
 */
type Config = Config_
/** @deprecated All types have been moved to `vite-plugin-ssr/types`.
 * Replace:
 *   `import type { Env } from 'vite-plugin-ssr'`
 * With:
 *   `import type { Env } from 'vite-plugin-ssr/types'`
 */
type Env = Env_
/** @deprecated All types have been moved to `vite-plugin-ssr/types`.
 * Replace:
 *   `import type { ConfigEntries } from 'vite-plugin-ssr'`
 * With:
 *   `import type { ConfigEntries } from 'vite-plugin-ssr/types'`
 */
type ConfigEntries = ConfigEntries_
