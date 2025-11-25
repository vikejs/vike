// Public usge
export type { GlobalContext }
export type { GlobalContextServer }
export type { GlobalContextClient }
export type { GlobalContextClientWithServerRouting }

import type { GlobalContextServerInternal } from '../server/runtime/globalContext.js'
import type { GlobalContextClientInternalWithServerRouting } from '../client/runtime-server-routing/getGlobalContextClientInternal.js'
import type { GlobalContextBasePublic } from '../shared/createGlobalContextShared.js'
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
