// https://vike.dev/usePageContext
export { usePageContext }
export { setPageContext }

import { inject } from 'vue'
import type { App, InjectionKey } from 'vue'
import type { PageContext } from './types'

const key: InjectionKey<PageContext> = Symbol()

/** https://vike.dev/usePageContext */
function usePageContext(): PageContext {
  const pageContext = inject(key)
  if (!pageContext) throw new Error('setPageContext() not called in parent')
  return pageContext
}

function setPageContext(app: App, pageContext: PageContext): void {
  app.provide(key, pageContext)
}
