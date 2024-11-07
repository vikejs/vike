import { assertServerRouting } from '../../utils/assertRoutingType'
assertServerRouting()

import './pageFiles'
import { getPageContext } from './getPageContext'
import { executeOnRenderClientHook } from '../shared/executeOnRenderClientHook'
import { assertHook } from '../../shared/hooks/getHook'
import { assertSingleInstance_onClientEntryServerRouting } from './utils'
import { removeFoucBuster } from '../shared/removeFoucBuster'
// @ts-ignore Since dist/cjs/client/ is never used, we can ignore this error.
const isProd: boolean = import.meta.env.PROD
assertSingleInstance_onClientEntryServerRouting(isProd)

if (import.meta.env.DEV) removeFoucBuster()

hydrate()

async function hydrate() {
  const pageContext = await getPageContext()
  await executeOnRenderClientHook(pageContext, false)
  assertHook(pageContext, 'onHydrationEnd')
  await pageContext.exports.onHydrationEnd?.(pageContext)
}
