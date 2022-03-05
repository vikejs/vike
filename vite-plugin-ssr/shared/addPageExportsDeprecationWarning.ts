export { addPageExportsDeprecationWarning }

import { assertWarning } from './utils'

let alreadyLogged = false

function addPageExportsDeprecationWarning(pageContext: { pageExports: Record<string, unknown> }) {
  const { pageExports } = pageContext
  Object.defineProperty(pageContext, 'pageExports', {
    get() {
      if (!alreadyLogged) {
        alreadyLogged = true
        assertWarning(
          false,
          '`pageContext.pageExports` is going to be deprecated in favor of `pageContext.exports`, see https://vite-plugin-ssr.com/exports',
        )
      }
      return pageExports
    },
    enumerable: false,
    configurable: false,
  })
}
