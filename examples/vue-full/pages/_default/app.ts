import { App, createSSRApp, defineComponent, h, markRaw, reactive } from 'vue'
import PageLayout from './PageLayout.vue'
import type { Component, PageContext } from './types'

export { createApp }

function createApp(pageContext: PageContext) {
  const { Page } = pageContext

  let rootComponent: Component
  const PageWithLayout = defineComponent({
    data: () => ({
      Page: markRaw(Page),
      pageProps: markRaw(pageContext.pageProps || {})
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

  // We use `reactive` because we use Client-side Routing.
  // When using Server-side Routing, we don't need `reactive`.
  const pageContextReactive = reactive(pageContext)
  const changePage = (pageContext: PageContext) => {
    Object.assign(pageContextReactive, pageContext)
    rootComponent.Page = markRaw(pageContext.Page)
    rootComponent.pageProps = markRaw(pageContext.pageProps || {})
  }

  const app: App<Element> & { changePage: typeof changePage } = Object.assign(createSSRApp(PageWithLayout), {
    changePage
  })
  app.config.globalProperties.$pageContext = pageContextReactive

  return app
}
