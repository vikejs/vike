import { createSSRApp, defineComponent, h } from 'vue'
import { getPage } from 'vite-plugin-ssr/client'
import PageLayout from '../components/PageLayout/PageLayout.vue'

hydrate()

async function hydrate() {
  const { Page, initialProps } = await getPage()
  const PageWithLayout = defineComponent({
    render() {
      return h(
        PageLayout,
        {},
        {
          default() {
            return h(Page, initialProps)
          }
        }
      )
    }
  })
  const app = createSSRApp(PageWithLayout)
  app.mount('#app')
}
