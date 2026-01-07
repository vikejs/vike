import '../assertEnvClient.js'

export { createPageContextClient }
export type PageContextCreatedClient = Awaited<ReturnType<typeof createPageContextClient>>

import { createPageContextObject, createPageContextShared } from '../../shared-server-client/createPageContextShared.js'
import { getPageContextUrlComputed } from '../../shared-server-client/getPageContextUrlComputed.js'
import { getBaseServer } from './getBaseServer.js'
import { getGlobalContextClientInternal } from './getGlobalContextClientInternal.js'
import { assert } from '../../utils/assert.js'
import { objectAssign } from '../../utils/objectAssign.js'
import { isBaseServer } from '../../utils/parseUrl.js'
import { updateType } from '../../utils/updateType.js'

async function createPageContextClient(urlOriginal: string) {
  const pageContext = createPageContextBase(urlOriginal)

  const globalContext = await getGlobalContextClientInternal()
  objectAssign(pageContext, {
    _globalContext: globalContext,
    _pageFilesAll: globalContext._pageFilesAll, // TO-DO/next-major-release: remove
  })
  const pageContextAugmented = createPageContextShared(pageContext, globalContext._globalConfigPublic)
  updateType(pageContext, pageContextAugmented)

  return pageContext
}

function createPageContextBase(urlOriginal: string) {
  const pageContext = createPageContextObject()
  objectAssign(pageContext, {
    isClientSide: true as const,
    isPrerendering: false as const,
    urlOriginal,
    _urlHandler: null,
  })

  const baseServer = getBaseServer()
  assert(isBaseServer(baseServer))
  objectAssign(pageContext, {
    _baseServer: baseServer,
  })

  const pageContextUrlComputed = getPageContextUrlComputed(pageContext)
  objectAssign(pageContext, pageContextUrlComputed)

  return pageContext
}
