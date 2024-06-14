import { createSSRApp, h } from 'vue'
import Layout from './Layout.vue'

export { createVueApp }

function createVueApp(pageContext) {
  const { Page, pageProps } = pageContext
  const RootComponent = () => h(Layout, null, () => h(Page, pageProps))
  const app = createSSRApp(RootComponent)
  return app
}
