import { assertServerRouting } from '../../utils/assertRoutingType.js'
assertServerRouting()

import { createPageContextClientSide } from './createPageContextClientSide.js'
import { execHookOnRenderClient } from '../shared/execHookOnRenderClient.js'
import { assertSingleInstance_onClientEntryServerRouting } from './utils.js'
import { removeFoucBuster } from '../shared/removeFoucBuster.js'
import { execHook } from '../../shared/hooks/execHook.js'
import { preparePageContextForPublicUsageClient } from './preparePageContextForPublicUsageClient.js'
// @ts-ignore Since dist/cjs/client/ is never used, we can ignore this error.
const isProd: boolean = import.meta.env.PROD
assertSingleInstance_onClientEntryServerRouting(isProd)

if (import.meta.env.DEV) removeFoucBuster()

hydrate()

async function hydrate() {
  const pageContext = await createPageContextClientSide()
  await execHookOnRenderClient(pageContext, preparePageContextForPublicUsageClient)
  await execHook('onHydrationEnd', pageContext, preparePageContextForPublicUsageClient)
}
