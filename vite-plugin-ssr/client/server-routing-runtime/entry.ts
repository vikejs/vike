export { someF }

import { setPageFiles } from '../../shared/getPageFiles.js'
// @ts-ignore
globalThis.__tmp_setPageFiles = setPageFiles
/*
export { setPageFiles } from '../../shared/getPageFiles.js'
*/

import { assertServerRouting } from '../../utils/assertRoutingType.js'
assertServerRouting()

import { getPageContext } from './getPageContext.js'
import { executeOnRenderClientHook } from '../shared/executeOnRenderClientHook.js'
import { assertHook } from '../../shared/hooks/getHook.js'
import { onClientEntry_ServerRouting } from './utils.js'
// @ts-ignore Since dist-cjs/client/ is never used, we can ignore this error.
const isProd: boolean = import.meta.env.PROD
onClientEntry_ServerRouting(isProd)

hydrate()

async function hydrate() {
  const pageContext = await getPageContext()
  await executeOnRenderClientHook(pageContext, false)
  assertHook(pageContext, 'onHydrationEnd')
  await pageContext.exports.onHydrationEnd?.(pageContext)
}

function someF() {
  console.log('SMM')
}
