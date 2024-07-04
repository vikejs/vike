import { assertServerRouting } from '../../utils/assertRoutingType.js'
assertServerRouting()

import './pageFiles'
import { getPageContext } from './getPageContext.js'
import { executeOnRenderClientHook } from '../shared/executeOnRenderClientHook.js'
import { assertHook } from '../../shared/hooks/getHook.js'
import { assertSingleInstance_onClientEntryServerRouting } from './utils.js'
// @ts-ignore Since dist/cjs/client/ is never used, we can ignore this error.
const isProd: boolean = import.meta.env.PROD
assertSingleInstance_onClientEntryServerRouting(isProd)

hydrate()

async function hydrate() {
  const pageContext = await getPageContext()
  await executeOnRenderClientHook(pageContext, false)
  assertHook(pageContext, 'onHydrationEnd')
  await pageContext.exports.onHydrationEnd?.(pageContext)
}
