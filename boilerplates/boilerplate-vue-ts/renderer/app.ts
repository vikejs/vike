import { createSSRApp, defineComponent, h } from 'vue'
import PageShell from './PageShell.vue'
import { setPageContext } from './usePageContext'
import type { PageContext } from 'vike/types'
import type { Component } from './types'

export { createApp }

function createApp(Page: Component, data: unknown, pageContext: PageContext) {
  const PageWithLayout = defineComponent({
    render() {
      return h(
        PageShell,
        {},
        {
          default() {
            // https://vike.dev/data#without-vike-extension
            return h(Page, data || {})
          }
        }
      )
    }
  })

  const app = createSSRApp(PageWithLayout)

  // Make pageContext available from any Vue component
  setPageContext(app, pageContext)

  return app
}
