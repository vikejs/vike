import './page-files/setup'
import { getPageContext } from './getPageContext'
import { assertRenderHook } from './assertRenderHook'
import { assertHook } from '../shared/getHook'

hydrate()

async function hydrate() {
  const pageContext = await getPageContext()
  assertRenderHook(pageContext)
  await pageContext.exports.render(pageContext)
  assertHook(pageContext, 'onHydrationEnd')
  await pageContext.exports.onHydrationEnd?.(pageContext)
}
