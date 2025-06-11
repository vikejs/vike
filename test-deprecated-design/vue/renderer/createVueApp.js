import { createSSRApp, h } from 'vue'
import Layout from './Layout.vue'

export { createVueApp }

function createVueApp(pageContext) {
  const { Page, pageProps } = pageContext
  const PageWithLayout = {
    render() {
      return h(
        Layout,
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
  return app
}
