import { createSSRApp, defineComponent, h, markRaw, reactive } from 'vue'
import LayoutDefault from './LayoutDefault.vue'
import { setPageContext } from './usePageContext'

export { createApp }

function createApp(pageContext) {
  const { Page } = pageContext

  let rootComponent
  const PageWithWrapper = defineComponent({
    data: () => ({
      Page: markRaw(Page),
      pageProps: markRaw(pageContext.pageProps || {}),
      // The config 'Layout' is a custom config we defined at ./+config.ts
      Layout: markRaw(pageContext.config.Layout || LayoutDefault)
    }),
    created() {
      rootComponent = this
    },
    render() {
      return h(
        this.Layout,
        {},
        {
          default: () => {
            return h(this.Page, this.pageProps)
          }
        }
      )
    }
  })

  const app = createSSRApp(PageWithWrapper)

  // We use `app.changePage()` to do Client Routing, see `+onRenderClient.js`
  app.changePage = (pageContext) => {
    Object.assign(pageContextReactive, pageContext)
    rootComponent.Page = markRaw(pageContext.Page)
    rootComponent.pageProps = markRaw(pageContext.pageProps || {})
    // The config 'Layout' is a custom config we defined at ./+config.ts
    rootComponent.Layout = markRaw(pageContext.config.Layout || LayoutDefault)
  }

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `+onRenderClient.js`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(pageContext)

  // Make `pageContext` accessible from any Vue component
  setPageContext(app, pageContextReactive)

  return app
}
