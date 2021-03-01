import { createSSRApp, defineComponent, h } from 'vue'
import PageLayout from './PageLayout.vue'
import { PageProps } from './types'

export { createApp }

function createApp(Page: any, pageProps: PageProps) {
  const PageWithLayout = defineComponent({
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
  })
  const app = createSSRApp(PageWithLayout)
  return app
}
