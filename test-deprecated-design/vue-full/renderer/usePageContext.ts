// https://vike.dev/usePageContext
export { usePageContext }
export { setPageContext }

import { inject } from 'vue'
import type { App } from 'vue'
import { PageContext } from './types'

const key = Symbol()

function usePageContext() {
  const pageContext = inject(key)
  return pageContext
}

function setPageContext(app: App, pageContext: PageContext) {
  app.provide(key, pageContext)
}
