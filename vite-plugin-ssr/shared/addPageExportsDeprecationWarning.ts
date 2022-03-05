export { addPageExportsDeprecationWarning }

import { assertWarning } from './utils'

function addPageExportsDeprecationWarning(pageContext: { pageExports: Record<string, unknown> }) {
  const { pageExports } = pageContext
  Object.defineProperty(pageContext, 'pageExports', {
    get() {
      assertWarning(
        false,
        '`pageContext.pageExports` is going to be deprecated in favor of `pageContext.exports`, see https://vite-plugin-ssr.com/exports.',
      )
      return pageExports
    },
    enumerable: false,
    configurable: false,
  })
}
