import { assertServerRouting } from '../../utils/assertRoutingType.js'
assertServerRouting()

import { createPageContextClientSide } from './createPageContextClientSide.js'
import { executeOnRenderClientHook } from '../shared/executeOnRenderClientHook.js'
import { getHookFromPageContext } from '../../shared/hooks/getHook.js'
import { assertSingleInstance_onClientEntryServerRouting, objectAssign } from './utils.js'
import { removeFoucBuster } from '../shared/removeFoucBuster.js'
import { executeHook } from '../../shared/hooks/executeHook.js'
import { getCurrentUrl } from '../shared/getCurrentUrl.js'
import { preparePageContextForUserConsumptionClient } from './preparePageContextForUserConsumptionClient.js'
// @ts-ignore Since dist/cjs/client/ is never used, we can ignore this error.
const isProd: boolean = import.meta.env.PROD
assertSingleInstance_onClientEntryServerRouting(isProd)

if (import.meta.env.DEV) removeFoucBuster()

hydrate()

async function hydrate() {
  const pageContext = await createPageContextClientSide()
  objectAssign(pageContext, { urlOriginal: getCurrentUrl() })
  await executeOnRenderClientHook(pageContext, preparePageContextForUserConsumptionClient)
  const hook = getHookFromPageContext(pageContext, 'onHydrationEnd')
  if (hook) await executeHook(() => hook.hookFn(pageContext), hook, pageContext)
}
