export { createApp }

import { createSSRApp, defineComponent, h, markRaw, reactive } from 'vue'
import PageShell from './PageShell.vue'
import { setPageContext } from './usePageContext'

function createApp(pageContext) {
  const { Page } = pageContext

  let rootComponent
  const PageWithShell = defineComponent({
    data: () => ({
      Page: markRaw(Page)
    }),
    created() {
      rootComponent = this
    },
    render() {
      return h(
        PageShell,
        {},
        {
          default: () => {
            return h(this.Page)
          }
        }
      )
    }
  })

  const app = createSSRApp(PageWithShell)

  // We use `app.changePage()` to do Client Routing, see `+onRenderClient.ts`
  Object.assign(app, {
    changePage: (pageContext) => {
      Object.assign(pageContextReactive, pageContext)
      rootComponent.Page = markRaw(pageContext.Page)
    }
  })

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `+onRenderClient.ts`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(pageContext)

  // Make pageContext available from any Vue component
  setPageContext(app, pageContextReactive)

  return app
}
