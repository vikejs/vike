import '../assertEnvClient.js'

export { getPageContextPublicClient }
export type { PageContextPublicClient }
export type { PageContextPublicProxyClient }

import { getPageContextPublicClientShared } from '../shared/getPageContextPublicClientShared.js'
import type { PageContextConfig } from '../../shared-server-client/getPageFiles.js'
import type { PageContextInternalClient_ClientRouting } from '../../types/PageContext.js'
import type { PageContextPublicMinimum } from '../../shared-server-client/getPageContextPublicShared.js'

type PageContextPublicClient = PageContextPublicMinimum &
  PageContextInternalClient_ClientRouting &
  PageContextConfig & { urlOriginal: string }

type PageContextPublicProxyClient = ReturnType<typeof getPageContextPublicClient>
function getPageContextPublicClient<PageContext extends PageContextPublicClient>(pageContext: PageContext) {
  return getPageContextPublicClientShared(pageContext)
}
