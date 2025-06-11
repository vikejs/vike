import { createPinia } from 'pinia'
import { createSSRApp, h, reactive, markRaw, ref } from 'vue'
import { setPageContext } from './usePageContext'

export { createVueApp }

function createVueApp(pageContext) {
  const pageRef = ref(markRaw(pageContext.Page))
  const pagePropsRef = ref(markRaw(pageContext.pageProps || {}))

  const app = createSSRApp({
    render() {
      return h(pageRef.value, pagePropsRef.value)
    },
  })

  const store = createPinia()
  app.use(store)

  // We use `app.changePage()` to do Client Routing, see `_default.page.client.js`
  Object.assign(app, {
    changePage: (pageContext) => {
      Object.assign(pageContextReactive, pageContext)
      pageRef.value = markRaw(pageContext.Page)
      pagePropsRef.value = markRaw(pageContext.pageProps || {})
    },
  })

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `_default.page.client.js`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(pageContext)

  setPageContext(app, pageContextReactive)

  return { app, store }
}
