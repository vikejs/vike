export { getPageContextProxyForUser }

import { assertUsage, getPropAccessNotation } from '../server-routing-runtime/utils.js'
import { NOT_SERIALIZABLE } from '../../shared/NOT_SERIALIZABLE.js'

// Throw error when pageContext value isn't serializable
function getPageContextProxyForUser<PageContext extends Record<string, unknown>>(
  pageContext: PageContext
): PageContext {
  return new Proxy(pageContext, {
    get(_: never, prop: string) {
      const val = pageContext[prop]
      const propName = getPropAccessNotation(prop)
      assertUsage(
        val !== NOT_SERIALIZABLE,
        `Can't access pageContext${propName} on the client side. Because it can't be serialized, see server logs.`
      )
      return val
    }
  })
}
