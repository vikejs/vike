import { createSSRApp, h } from 'vue'
import PageLayout from './PageLayout.vue'

export { getApp }

function getApp({ Page, pageProps }) {
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
