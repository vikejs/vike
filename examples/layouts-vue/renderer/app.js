import { createSSRApp, defineComponent, h, markRaw, reactive, ref } from 'vue'
import LayoutDefault from './LayoutDefault.vue'
import { setPageContext } from './usePageContext'

export { createApp }

function createApp(pageContext) {
  const { Page } = pageContext

  const pageRef = ref(markRaw(Page))
  const pagePropsRef = ref(markRaw(pageContext.pageProps || {}))
  // The config 'Layout' is a custom config we defined at ./+config.ts
  const layoutRef = ref(markRaw(pageContext.config.Layout || LayoutDefault))

  const PageWithWrapper = defineComponent({
    render() {
      return h(layoutRef.value, {}, { default: () => h(pageRef.value, pagePropsRef.value) })
    }
  })

  const app = createSSRApp(PageWithWrapper)

  // We use `app.changePage()` to do Client Routing, see `+onRenderClient.js`
  app.changePage = (pageContext) => {
    Object.assign(pageContextReactive, pageContext)
    pageRef.value = markRaw(pageContext.Page)
    pagePropsRef.value = markRaw(pageContext.pageProps || {})
    // The config 'Layout' is a custom config we defined at ./+config.ts
    layoutRef.value = markRaw(pageContext.config.Layout || LayoutDefault)
  }

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `+onRenderClient.js`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(pageContext)

  // Make `pageContext` accessible from any Vue component
  setPageContext(app, pageContextReactive)

  return app
}
