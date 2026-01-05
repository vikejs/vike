import '../../assertEnvServer.js'
export { getPageContextPublicServer }
export type { PageContextPublicServer }

import {
  assertPropertyGetters,
  getPageContextPublicShared,
  type PageContextPublicMinimum,
} from '../../../shared-server-client/getPageContextPublicShared.js'

type PageContextPublicServer = ReturnType<typeof getPageContextPublicServer>
function getPageContextPublicServer<PageContext extends PageContextPublicMinimum>(pageContext: PageContext) {
  // TO-DO/next-major-release: after we remove supportVueReactiviy() we can call this later inside the agnostic getPageContextPublicShared()
  assertPropertyGetters(pageContext)
  const pageContextPublic = getPageContextPublicShared(pageContext)
  return pageContextPublic
}
