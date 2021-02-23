import { createSSRApp, defineComponent, h } from 'vue'
import PageLayout from './PageLayout.vue'

export { getApp }
export { PageProps }

type PageProps = {
  title?: string
}

function getApp(Page: any, pageProps: PageProps) {
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
