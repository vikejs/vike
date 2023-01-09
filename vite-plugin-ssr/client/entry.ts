import './pageFiles'
import { getPageContext } from './getPageContext'
import { assertRenderHook } from './getRenderHook'
import { assertHook } from '../shared/getHook'
import { assertIsBundledOnce } from './utils'

if (import.meta.env.PROD) assertIsBundledOnce()
hydrate()

async function hydrate() {
  const pageContext = await getPageContext()
  assertRenderHook(pageContext)
  await pageContext.exports.render(pageContext)
  assertHook(pageContext, 'onHydrationEnd')
  await pageContext.exports.onHydrationEnd?.(pageContext)
}
