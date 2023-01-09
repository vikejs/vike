import './pageFiles'
import { getPageContext } from './getPageContext'
import { executeOnClientRender } from './executeRenderHook'
import { assertHook } from '../shared/getHook'
import { assertIsBundledOnce } from './utils'

if (import.meta.env.PROD) assertIsBundledOnce()
hydrate()

async function hydrate() {
  const pageContext = await getPageContext()
  await executeOnClientRender(pageContext, false)
  assertHook(pageContext, 'onHydrationEnd') // TODO
  await pageContext.exports.onHydrationEnd?.(pageContext)
}
