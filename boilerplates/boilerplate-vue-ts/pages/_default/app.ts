import { createSSRApp, defineComponent, h } from 'vue'
import PageWrapper from './PageWrapper.vue'
import { PageContext } from './types'

export { createApp }

function createApp(pageContext: PageContext) {
  const { Page, pageProps } = pageContext
  const PageWithLayout = defineComponent({
    render() {
      return h(
        PageWrapper,
        {},
        {
          default() {
            return h(Page, pageProps || {})
          }
        }
      )
    }
  })

  const app = createSSRApp(PageWithLayout)

  // We make `pageContext` available in all components as `$pageContext`.
  // More infos: https://vite-plugin-ssr.com/pageContext-anywhere
  app.config.globalProperties.$pageContext = pageContext

  return app
}
