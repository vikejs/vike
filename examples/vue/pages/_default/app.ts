import { App, createSSRApp, defineComponent, h, markRaw } from 'vue'
import PageLayout from './PageLayout.vue'
import { Component, PageContext } from './types'

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

  const changePage = (pageContext: PageContext) => {
    rootComponent.Page = markRaw(pageContext.Page)
    rootComponent.pageProps = markRaw(pageContext.pageProps || {})
    setRouteParams(pageContext)
  }
  const app: App<Element> & { changePage: typeof changePage } = Object.assign(createSSRApp(PageWithLayout), {
    changePage
  })

  const setRouteParams = (pageContext: PageContext) => {
    app.config.globalProperties.$routeParams = pageContext.routeParams
  }
  setRouteParams(pageContext)

  return app
}
