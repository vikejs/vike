/*
 * @Descripttion: 
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2023-08-04 17:39:02
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-07 16:12:25
 */
import { createSSRApp, defineComponent, h, markRaw, reactive } from 'vue'
import painia from './stores/store'
import PageShell from './PageShell.vue'
import type { Component, PageContext } from './types'
import { setPageContext } from './usePageContext'


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
        PageShell,
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
  // 注册Pinia
  app.use(painia);

  // We use `app.changePage()` to do Client Routing, see `_default.page.client.js`
  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      Object.assign(pageContextReactive, pageContext)
      rootComponent.Page = markRaw(pageContext.Page)
      rootComponent.pageProps = markRaw(pageContext.pageProps || {})
    }
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
  objAddendum: ObjAddendum
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum)
}
