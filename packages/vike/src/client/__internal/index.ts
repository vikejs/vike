// Used by vike-react-rsc
export { readPageContextJson } from '../runtime-client-routing/streamedValues.js'
export { createPageContextFromServer }

import type { PageContextClient } from '../../types/PageContext.js'
import { processPageContextFromServer } from '../runtime-client-routing/getPageContextFromHooks.js'
import { getPageContextPublicClient } from '../runtime-client-routing/getPageContextPublicClient.js'
import { objectAssign } from '../../utils/objectAssign.js'
import '../assertEnvClient.js'

/** A new `pageContext` of the page `pageContext` renders, with the values the server sent on top: the object `pageContext` stays as it is */
function createPageContextFromServer<PageContext extends PageContextClient>(
  pageContext: PageContext,
  pageContextFromServer: Record<string, unknown>,
): PageContext {
  processPageContextFromServer(pageContextFromServer)
  const pageContextNew = {}
  objectAssign(pageContextNew, (pageContext as PageContext & { _originalObject: object })._originalObject, true)
  objectAssign(pageContextNew, pageContextFromServer)
  return getPageContextPublicClient(pageContextNew as Parameters<typeof getPageContextPublicClient>[0]) as PageContext
}
