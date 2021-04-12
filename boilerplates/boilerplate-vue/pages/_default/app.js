import { createSSRApp, h } from 'vue'
import PageLayout from './PageLayout.vue'

export { createApp }

function createApp(Page, pageProps = {}) {
  const PageWithLayout = {
    render() {
      return h(
        PageLayout,
        {},
        {
          default() {
            return h(Page, pageProps)
          }
        }
      )
    }
  }
  const app = createSSRApp(PageWithLayout)
  return app
}
