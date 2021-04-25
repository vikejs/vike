import { App, createSSRApp, defineComponent, h, markRaw } from 'vue'
import PageLayout from './PageLayout.vue'
import { Component, ContextProps } from './types'

export { createApp }

function createApp(Page: Component, contextProps: ContextProps) {
  let rootComponent: Component
  const PageWithLayout = defineComponent({
    data: () => ({
      Page: markRaw(Page),
      pageProps: markRaw(contextProps.pageProps || {})
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

  const changePage = (Page: Component, contextProps: ContextProps) => {
    rootComponent.Page = markRaw(Page)
    rootComponent.pageProps = markRaw(contextProps.pageProps || {})
    setRouteParams(contextProps)
  }
  const app: App<Element> & { changePage: typeof changePage } = Object.assign(createSSRApp(PageWithLayout), {
    changePage
  })

  const setRouteParams = (contextProps: ContextProps) => {
    app.config.globalProperties.$routeParams = contextProps.routeParams
  }
  setRouteParams(contextProps)

  return app
}
