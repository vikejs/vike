import { App, createSSRApp, defineComponent, h, markRaw, reactive } from 'vue'
import PageWrapper from './PageWrapper.vue'
import type { Component, PageContext } from './types'

export { createApp }

function createApp(pageContext: PageContext) {
  const { Page } = pageContext

  let rootComponent: Component
  const PageWithWrapper = defineComponent({
    data: () => ({
      Page: markRaw(Page),
      pageProps: markRaw(pageContext.pageProps || {})
    }),
    created() {
      rootComponent = this
    },
    render() {
      return h(
        PageWrapper,
        {},
        {
          default: () => {
            return h(this.Page, this.pageProps)
          }
        }
      )
    }
  })

  // We use `reactive` because we use Client Routing.
  // When using Server Routing, we don't need `reactive`.
  const pageContextReactive = reactive(pageContext)
  const changePage = (pageContext: PageContext) => {
    Object.assign(pageContextReactive, pageContext)
    rootComponent.Page = markRaw(pageContext.Page)
    rootComponent.pageProps = markRaw(pageContext.pageProps || {})
  }

  const app: App<Element> & { changePage: typeof changePage } = Object.assign(createSSRApp(PageWithWrapper), {
    changePage
  })
  app.config.globalProperties.$pageContext = pageContextReactive

  return app
}
