export { createApp }

import { createSSRApp, defineComponent, h, markRaw, reactive, ref } from 'vue'
import PageShell from './PageShell.vue'
import { setPageContext } from './usePageContext'
import type { PageContext } from 'vike/types'

function createApp(pageContext: PageContext) {
  const { Page } = pageContext

  const pageRef = ref(markRaw(Page))
  const PageWithShell = defineComponent({
    render() {
      return h(PageShell, {}, { default: () => h(pageRef.value) })
    }
  })

  const app = createSSRApp(PageWithShell)

  // We use `app.changePage()` to do Client Routing, see `+onRenderClient.ts`
  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      Object.assign(pageContextReactive, pageContext)
      pageRef.value = markRaw(pageContext.Page)
    }
  })

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `+onRenderClient.ts`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(pageContext)

  // Make pageContext available from any Vue component
  setPageContext(app, pageContextReactive)

  return app
}

// Same as `Object.assign()` but with type inference
function objectAssign<Obj extends object, ObjAddendum>(
  obj: Obj,
  objAddendum: ObjAddendum
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum)
}
