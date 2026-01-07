import '../assertEnvClient.js'

export { getPageContextPublicClient }
export type { PageContextPublicClient }

import { getPageContextPublicClientShared } from '../shared/getPageContextPublicClientShared.js'
import type { PageContextConfig } from '../../shared-server-client/getPageFiles.js'
import type { PageContextInternalClient_ServerRouting } from '../../types/PageContext.js'
import type { PageContextPublicMinimum } from '../../shared-server-client/getPageContextPublicShared.js'

type PageContextPublicClient = PageContextPublicMinimum & PageContextInternalClient_ServerRouting & PageContextConfig

function getPageContextPublicClient<PageContext extends PageContextPublicClient>(pageContext: PageContext) {
  return getPageContextPublicClientShared(pageContext)
}
