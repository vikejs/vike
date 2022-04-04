import { createSSRApp, h } from 'vue'
import { createPinia } from 'pinia'
import PageShell from './PageShell.vue'
import { setPageContext } from './usePageContext'

export { createApp }

function createApp(pageContext) {
  const { Page, pageProps } = pageContext
  const PageWithLayout = {
    render() {
      return h(
        PageShell,
        {},
        {
          default() {
            return h(Page, pageProps || {})
          },
        },
      )
    },
  }

  const app = createSSRApp(PageWithLayout)
  const store = createPinia();
  app.use(store)

  // We make `pageContext` available from any Vue component
  setPageContext(app, pageContext)

  return app
}
