export { createApp }

import { createSSRApp, h, markRaw, reactive, ref } from 'vue'
import PageLayout from './PageLayout.vue'
import { setPageContext } from './usePageContext'

function createApp(pageContext) {
  const { Page } = pageContext

  const pageRef = ref(markRaw(Page))

  const PageWithLayout = {
    render() {
      return h(PageLayout, {}, { default: () => h(pageRef.value) })
    }
  }

  const app = createSSRApp(PageWithLayout)

  // We use `app.changePage()` to do Client Routing, see `+onRenderClient.ts`
  Object.assign(app, {
    changePage: (pageContext) => {
      Object.assign(pageContextReactive, pageContext)
      pageRef.value = markRaw(pageContext.Page)
    }
  })

  // When doing Client Routing, we mutate pageContext (see usage of app.changePage() in +onRenderClient.ts).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(pageContext)

  // Make pageContext available from any Vue component
  setPageContext(app, pageContextReactive)

  return app
}
