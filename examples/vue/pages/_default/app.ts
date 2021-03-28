import { App, createSSRApp, defineComponent, h, markRaw } from 'vue'
import PageLayout from './PageLayout.vue'

export { getApp }
export { PageProps }

type PageProps = {
  docTitle?: string
}

function getApp(Page: any, pageProps: PageProps) {
  let rootComponent: any
  const PageWithLayout = defineComponent({
    data: () => ({
      Page: markRaw(Page),
      pageProps: markRaw(pageProps)
    }),
    created() {
      rootComponent = this
    },
    render() {
      return h(
        PageLayout,
        {},
        {
          default: () => {
            return h(this.Page, this.pageProps)
          }
        }
      )
    }
  })
  const app: App<Element> & { changePage?: any } = createSSRApp(PageWithLayout)
  app.changePage = (Page: any, pageProps: Record<string, unknown>) => {
    rootComponent.Page = markRaw(Page)
    rootComponent.pageProps = markRaw(pageProps)
  }
  return app
}
