import { assertServerRouting } from '../../utils/assertRoutingType.mjs'
assertServerRouting()

import './pageFiles'
import { getPageContext } from './getPageContext.mjs'
import { executeOnRenderClientHook } from '../shared/executeOnRenderClientHook.mjs'
import { assertHook } from '../../shared/hooks/getHook.mjs'
import { onClientEntry_ServerRouting } from './utils.mjs'
onClientEntry_ServerRouting(import.meta.env.PROD)

hydrate()

async function hydrate() {
  const pageContext = await getPageContext()
  await executeOnRenderClientHook(pageContext, false)
  assertHook(pageContext, 'onHydrationEnd')
  await pageContext.exports.onHydrationEnd?.(pageContext)
}
