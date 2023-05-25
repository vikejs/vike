import { assertServerRouting } from '../utils/assertRoutingType'
assertServerRouting()

import './pageFiles'
import { getPageContext } from './getPageContext'
import { executeOnRenderClientHook } from './executeOnRenderClientHook'
import { assertHook } from '../shared/getHook'
import { onClientEntry_ServerRouting } from './utils'
onClientEntry_ServerRouting(import.meta.env.PROD)

hydrate()

async function hydrate() {
  const pageContext = await getPageContext()
  await executeOnRenderClientHook(pageContext, false)
  assertHook(pageContext, 'onHydrationEnd') // TODO
  await pageContext.exports.onHydrationEnd?.(pageContext)
}
