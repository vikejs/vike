// Same as ./index.ts but with deprecation notice.

// TODO/v1-release: remove this file

export type {
  PageContextBuiltIn,
  PageContextBuiltInClientWithClientRouting,
  PageContextBuiltInClientWithServerRouting,
  InjectFilterEntry,
  Config,
  Env,
  ConfigEntries,
}
import type {
  PageContextBuiltInServer,
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClientWithClientRouting_,
  PageContextBuiltInClientWithServerRouting as PageContextBuiltInClientWithServerRouting_,
  InjectFilterEntry as InjectFilterEntry_,
  Config as Config_,
  Env as Env_,
  ConfigEntries as ConfigEntries_,
} from './index.js'

/** @deprecated All types have been moved to `vike/types`.
 * Replace:
 *   `import type { PageContextBuiltIn } from 'vike'`
 * With:
 *   `import type { PageContextBuiltInServer } from 'vike/types'`
 */
type PageContextBuiltIn<Page = any> = PageContextBuiltInServer<Page>
/** @deprecated All types have been moved to `vike/types`.
 * Replace:
 *   `import type { PageContextBuiltInClientWithClientRouting } from 'vike'`
 * With:
 *   `import type { PageContextBuiltInClientWithClientRouting } from 'vike/types'`
 */
type PageContextBuiltInClientWithClientRouting<Page = any> = PageContextBuiltInClientWithClientRouting_<Page>
/** @deprecated All types have been moved to `vike/types`.
 * Replace:
 *   `import type { PageContextBuiltInClientWithServerRouting } from 'vike'`
 * With:
 *   `import type { PageContextBuiltInClientWithServerRouting } from 'vike/types'`
 */
type PageContextBuiltInClientWithServerRouting<Page = any> = PageContextBuiltInClientWithServerRouting_<Page>
/** @deprecated All types have been moved to `vike/types`.
 * Replace:
 *   `import type { InjectFilterEntry } from 'vike'`
 * With:
 *   `import type { InjectFilterEntry } from 'vike/types'`
 */
type InjectFilterEntry = InjectFilterEntry_
/** @deprecated All types have been moved to `vike/types`.
 * Replace:
 *   `import type { Config } from 'vike'`
 * With:
 *   `import type { Config } from 'vike/types'`
 */
type Config = Config_
/** @deprecated All types have been moved to `vike/types`.
 * Replace:
 *   `import type { Env } from 'vike'`
 * With:
 *   `import type { Env } from 'vike/types'`
 */
type Env = Env_
/** @deprecated All types have been moved to `vike/types`.
 * Replace:
 *   `import type { ConfigEntries } from 'vike'`
 * With:
 *   `import type { ConfigEntries } from 'vike/types'`
 */
type ConfigEntries = ConfigEntries_
