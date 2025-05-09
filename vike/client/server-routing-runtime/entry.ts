import { assertServerRouting } from '../../utils/assertRoutingType.js'
assertServerRouting()

import { createPageContextClientSide } from './createPageContextClientSide.js'
import { executeOnRenderClientHook } from '../shared/executeOnRenderClientHook.js'
import { assertSingleInstance_onClientEntryServerRouting } from './utils.js'
import { removeFoucBuster } from '../shared/removeFoucBuster.js'
import { executeHookNew } from '../../shared/hooks/executeHook.js'
import { preparePageContextForUserConsumptionClient } from './preparePageContextForUserConsumptionClient.js'
// @ts-ignore Since dist/cjs/client/ is never used, we can ignore this error.
const isProd: boolean = import.meta.env.PROD
assertSingleInstance_onClientEntryServerRouting(isProd)

if (import.meta.env.DEV) removeFoucBuster()

hydrate()

async function hydrate() {
  const pageContext = await createPageContextClientSide()
  await executeOnRenderClientHook(pageContext, preparePageContextForUserConsumptionClient)
  await executeHookNew('onHydrationEnd', pageContext, preparePageContextForUserConsumptionClient)
}
