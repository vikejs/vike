// `usePageContext` allows us to access `pageContext` in any Vue component.
// See https://vike.dev/pageContext-anywhere

import { inject } from 'vue'

export { usePageContext }
export { setPageContext }

const key = Symbol()

function usePageContext() {
  const pageContext = inject(key)
  return pageContext
}

function setPageContext(app, pageContext) {
  app.provide(key, pageContext)
}
