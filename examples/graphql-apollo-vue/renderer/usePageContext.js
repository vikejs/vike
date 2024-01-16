// https://vike.dev/usePageContext
export { usePageContext }
export { setPageContext }

import { inject } from 'vue'
const key = Symbol()

/** https://vike.dev/usePageContext */
function usePageContext() {
  const pageContext = inject(key)
  return pageContext
}

function setPageContext(app, pageContext) {
  app.provide(key, pageContext)
}
