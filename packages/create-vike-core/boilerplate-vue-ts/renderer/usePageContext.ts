// https://vike.dev/usePageContext
export { usePageContext }
export { setPageContext }

import { inject } from 'vue'
import type { App, InjectionKey, Ref } from 'vue'
import type { PageContext } from 'vike/types'

const key: InjectionKey<Ref<PageContext>> = Symbol()

/** https://vike.dev/usePageContext */
function usePageContext(): Ref<PageContext> {
  const pageContext = inject(key)
  if (!pageContext) throw new Error('setPageContext() not called in parent')
  return pageContext
}

function setPageContext(app: App, pageContext: Ref<PageContext>): void {
  app.provide(key, pageContext)
}
