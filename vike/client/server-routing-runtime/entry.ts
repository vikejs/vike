import { assertServerRouting } from '../../utils/assertRoutingType.js'
assertServerRouting()

import { createPageContextClientSide } from './createPageContextClientSide.js'
import { executeOnRenderClientHook } from '../shared/executeOnRenderClientHook.js'
import { assertHook } from '../../shared/hooks/getHook.js'
import { assertSingleInstance_onClientEntryServerRouting } from './utils.js'
import { removeFoucBuster } from '../shared/removeFoucBuster.js'
// @ts-ignore Since dist/cjs/client/ is never used, we can ignore this error.
const isProd: boolean = import.meta.env.PROD
assertSingleInstance_onClientEntryServerRouting(isProd)

if (import.meta.env.DEV) removeFoucBuster()

hydrate()

async function hydrate() {
  const pageContext = await createPageContextClientSide()
  await executeOnRenderClientHook(pageContext, false)
  assertHook(pageContext, 'onHydrationEnd')
  await pageContext.exports.onHydrationEnd?.(pageContext)
}
