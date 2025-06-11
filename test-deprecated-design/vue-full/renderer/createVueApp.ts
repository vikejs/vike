import { createSSRApp, defineComponent, h, markRaw, reactive, ref } from 'vue'
import Layout from './Layout.vue'
import type { PageContext } from './types'
import { setPageContext } from './usePageContext'

export { createVueApp }

function createVueApp(pageContext: PageContext) {
  const { Page } = pageContext

  const pageRef = ref(markRaw(Page))
  const pagePropsRef = ref(markRaw(pageContext.pageProps || {}))

  const PageWithWrapper = defineComponent({
    render() {
      return h(Layout, {}, { default: () => h(pageRef.value, pagePropsRef.value) })
    },
  })

  const app = createSSRApp(PageWithWrapper)

  // We use `app.changePage()` to do Client Routing, see `_default.page.client.js`
  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      Object.assign(pageContextReactive, pageContext)
      pageRef.value = markRaw(pageContext.Page)
      pagePropsRef.value = markRaw(pageContext.pageProps || {})
    },
  })

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `_default.page.client.js`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(pageContext)

  // Make `pageContext` accessible from any Vue component
  setPageContext(app, pageContextReactive)

  return app
}

// Same as `Object.assign()` but with type inference
function objectAssign<Obj extends object, ObjAddendum>(
  obj: Obj,
  objAddendum: ObjAddendum,
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum)
}
