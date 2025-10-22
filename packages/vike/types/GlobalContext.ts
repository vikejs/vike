// Public usge
export type { GlobalContext }
export type { GlobalContextServer }
export type { GlobalContextClient }
export type { GlobalContextClientWithServerRouting }

import type { GlobalContextServerInternal } from '../node/runtime/globalContext.js'
import type { GlobalContextClientWithServerRouting } from '../client/runtime-server-routing/getGlobalContextClientInternal.js'
import type { GlobalContextClient } from '../client/runtime-client-routing/getGlobalContextClientInternal.js'

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
> &
  // https://vike.dev/globalContext#typescript
  Vike.GlobalContext &
  Vike.GlobalContextServer
