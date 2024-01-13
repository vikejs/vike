import { createSSRApp, h } from 'vue'
import PageShell from './PageShell.vue'
import { setPageContext } from './usePageContext'

export { createApp }

function createApp(Page, data, pageContext) {
  const PageWithLayout = {
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
  }

  const app = createSSRApp(PageWithLayout)

  // We make pageContext available from any Vue component
  setPageContext(app, pageContext)

  return app
}
