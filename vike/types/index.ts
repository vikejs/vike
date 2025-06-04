export type {
  PageContext,
  PageContextServer,
  PageContextClient,
  GlobalContext,
  GlobalContextServer,
  GlobalContextClient,
  PageContextWithServerRouting,
  PageContextClientWithServerRouting,
  GlobalContextClientWithServerRouting
} from './PageContext.js'

// TODO/v1-release: remove these three exports
export type { PageContextBuiltInServer } from './PageContext.js'
export type { PageContextBuiltInClientWithClientRouting } from './PageContext.js'
export type { PageContextBuiltInClientWithServerRouting } from './PageContext.js'

export type {
  Config,
  ConfigMeta as Meta,
  ImportString,
  DataAsync,
  DataSync,
  GuardAsync,
  GuardSync,
  OnBeforePrerenderStartAsync,
  OnBeforePrerenderStartSync,
  OnBeforeRenderAsync,
  OnBeforeRenderSync,
  OnBeforeRouteAsync,
  OnBeforeRouteSync,
  OnHydrationEndAsync,
  OnHydrationEndSync,
  OnPageTransitionEndAsync,
  OnPageTransitionEndSync,
  OnPageTransitionStartAsync,
  OnPageTransitionStartSync,
  OnPrerenderStartAsync,
  OnPrerenderStartSync,
  OnRenderClientAsync,
  OnRenderClientSync,
  OnRenderHtmlAsync,
  OnRenderHtmlSync,
  RouteAsync,
  RouteSync,
  KeepScrollPosition
} from './Config.js'
export type { ConfigResolved } from './Config/PageContextConfig.js'
export type { ConfigEnv } from './PageConfig.js'
export type {
  ConfigDefinition,
  ConfigEffect
} from '../node/vite/shared/resolveVikeConfig/configDefinitionsBuiltIn.js'
export type { ConfigEntries } from '../shared/page-configs/getVikeConfigPublic.js'

export type { VikeConfig } from '../node/vite/shared/resolveVikeConfig.js'

export type { UrlPublic as Url } from '../utils/parseUrl.js'

export type { InjectFilterEntry } from '../node/runtime/html/injectAssets/getHtmlTags.js'

export { defineConfig } from './defineConfig.js'

// TODO/v1-release: remove
import type { ConfigEnv } from './PageConfig.js'
/** @deprecated Replace:
 *   `import type { Env } from 'vike/types'`
 * With:
 *   `import type { ConfigEnv } from 'vike/types'`
 */
type Env = ConfigEnv
export type { Env }

import type { ConfigEffect } from '../node/vite/shared/resolveVikeConfig/configDefinitionsBuiltIn.js'
// TODO/v1-release: remove
/** @deprecated Replace:
 *   `import type { Effect } from 'vike/types'`
 * With:
 *   `import type { ConfigEffect } from 'vike/types'`
 */
type Effect = ConfigEffect
export type { Effect }

// TODO/v1-release: remove
// Ancient Vike versions used to have `import type { PageContextBuiltInClient } from 'vike/types'`
import { PageContextBuiltInClientWithServerRouting } from './PageContext.js'
/** @deprecated Replace:
 *   `import type { PageContextBuiltInClient } from 'vike/types'`
 * With:
 *   `import type { PageContextBuiltInClientWithServerRouting } from 'vike/types'`
 * Or:
 *   `import type { PageContextBuiltInClientWithClientRouting } from 'vike/types'`
 */
type PageContextBuiltInClient<Page = any> = PageContextBuiltInClientWithServerRouting<Page>
export type { PageContextBuiltInClient }

// TODO/v1-release: remove
import { PageContextBuiltInServer } from './PageContext.js'
/** @deprecated Replace:
 *   `import type { PageContextBuiltIn } from 'vike/types'`
 * With:
 *   `import type { PageContextBuiltInServer } from 'vike/types'`
 */
type PageContextBuiltIn<Page = any> = PageContextBuiltInServer<Page>
export type { PageContextBuiltIn }
