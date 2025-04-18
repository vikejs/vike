export { createPageContextClientSide }

import { createPageContextShared } from '../../shared/createPageContextShared.js'
import { getPageContextUrlComputed } from '../../shared/getPageContextUrlComputed.js'
import { getBaseServer } from './getBaseServer.js'
import { getGlobalContext } from './globalContext.js'
import { assert, augmentType, isBaseServer, objectAssign } from './utils.js'

async function createPageContextClientSide(urlOriginal: string) {
  const globalContext = await getGlobalContext()

  const baseServer = getBaseServer()
  assert(isBaseServer(baseServer))

  const pageContextCreated = {
    ...globalContext, // least precedence
    globalContext,
    isClientSide: true,
    isPrerendering: false,
    urlOriginal,
    _urlHandler: null,
    _urlRewrite: null,
    _baseServer: baseServer
  }
  const pageContextUrlComputed = getPageContextUrlComputed(pageContextCreated)
  objectAssign(pageContextCreated, pageContextUrlComputed)

  const pageContextAugmented = await createPageContextShared(pageContextCreated, globalContext._pageConfigGlobal)
  augmentType(pageContextCreated, pageContextAugmented)

  return pageContextCreated
}
