// Public usge
export type { GlobalContext }
export type { GlobalContextServer }
export type { GlobalContextClient }
export type { GlobalContextClientWithServerRouting }

import type { PlusMiddleware } from '../server/runtime/plusMiddlewares.js'
import type { GlobalContextServerInternal } from '../server/runtime/globalContext.js'
import type { GlobalContextClientInternalWithServerRouting } from '../client/runtime-server-routing/getGlobalContextClientInternal.js'
import type { GlobalContextBasePublic } from '../shared-server-client/createGlobalContextShared.js'
import type { GlobalContextClientInternal } from '../client/runtime-client-routing/getGlobalContextClientInternal.js'

type GlobalContext = GlobalContextServer | GlobalContextClient

type GlobalContextServer = Pick<
  GlobalContextServerInternal,
  | 'assetsManifest'
  | 'config'
  | 'viteConfig'
  | 'viteConfigRuntime'
  | 'pages'
  | 'baseServer'
  | 'baseAssets'
  | 'isClientSide'
> & {
  /**
   * @experimental
   *
   * Every `+middleware` as a Universal Middleware, then Vike's catch-all that renders your pages as the last element. Server only.
   *
   * Each element has an `isHandler` property. Apply the ones that aren't handlers before your server's routes, and the ones that are
   * after (the handlers answer after your routes, so that a route can override one). `vike(app)` does it for you.
   *
   * The elements run their `+middleware` with the `path` matched against the page's URL (Base URL, `.pageContext.json`), so they survive filtering and re-ordering.
   *
   * @example
   * ```js
   * import { apply } from '@universal-middleware/express'
   * import assert from 'node:assert'
   * import { getGlobalContext } from 'vike/server'
   *
   * const globalContext = await getGlobalContext()
   * assert(!globalContext.isClientSide)
   * const { middlewares } = globalContext
   * apply(app, middlewares.filter((m) => !m.isHandler))
   * app.get('/api/hello', (req, res) => res.send('Hello'))
   * apply(app, middlewares.filter((m) => m.isHandler))
   * ```
   *
   * https://vike.dev/renderPage
   */
  middlewares: PlusMiddleware[]
  /** https://vike.dev/warning/internals */
  dangerouslyUseInternals: GlobalContextServerInternal
} & Vike.GlobalContext &
  Vike.GlobalContextServer

type GlobalContextClient = GlobalContextBasePublic & {
  /** https://vike.dev/warning/internals */
  dangerouslyUseInternals: GlobalContextClientInternal
} & Pick<GlobalContextClientInternal, 'isClientSide'> &
  Vike.GlobalContext &
  Vike.GlobalContextClient & {
    // Nothing extra for now
  }

type GlobalContextClientWithServerRouting = GlobalContextBasePublic &
  Pick<GlobalContextClientInternalWithServerRouting, 'isClientSide'> &
  Vike.GlobalContext &
  Vike.GlobalContextClient & {
    // Nothing extra for now
  }
