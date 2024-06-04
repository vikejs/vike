export { createApp }

import { createSSRApp, h, markRaw, reactive, ref } from 'vue'
import PageLayout from './PageLayout.vue'
import { setPageContext } from './usePageContext'
import { setData } from './useData'
import { isObject } from './utils'

function createApp(pageContext) {
  const { Page } = pageContext

  const pageRef = ref(markRaw(Page))

  const PageWithLayout = {
    render() {
      return h(PageLayout, {}, { default: () => h(pageRef.value) })
    }
  }

  const app = createSSRApp(PageWithLayout)

  // app.changePage() is called upon navigation, see +onRenderClient.ts
  Object.assign(app, {
    changePage: (pageContext) => {
      const data = pageContext.data ?? {}
      assertDataIsObject(data)
      Object.assign(dataReactive, data)
      Object.assign(pageContextReactive, pageContext)
      pageRef.value = markRaw(pageContext.Page)
    }
  })

  const data = pageContext.data ?? {}
  assertDataIsObject(data)
  const dataReactive = reactive(data)
  const pageContextReactive = reactive(pageContext)
  setPageContext(app, pageContextReactive)
  setData(app, dataReactive)

  return app
}

function assertDataIsObject(data) {
  if (!isObject(data)) throw new Error('Return value of data() hook should be an object, undefined, or null')
}
