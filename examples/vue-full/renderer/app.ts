export { createApp }

import { createSSRApp, h, markRaw, reactive, ref } from 'vue'
import PageLayout from './PageLayout.vue'
import { setPageContext } from './usePageContext'
import type { PageContext } from 'vike/types'
import { objectAssign } from './utils'

function createApp(pageContext: PageContext) {
  const { Page } = pageContext

  const pageRef = ref(markRaw(Page))

  const PageWithLayout = {
    render() {
      return h(PageLayout, {}, { default: () => h(pageRef.value) })
    }
  }

  const app = createSSRApp(PageWithLayout)

  // app.changePage() is called upon navigation, see +onRenderClient.ts
  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      Object.assign(pageContextReactive, pageContext)
      pageRef.value = markRaw(pageContext.Page)
    }
  })

  const pageContextReactive = reactive(pageContext)
  setPageContext(app, pageContextReactive)

  return app
}
