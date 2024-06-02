export { createApp }

import { createSSRApp, h, markRaw, reactive, ref } from 'vue'
import PageLayout from './PageLayout.vue'
import { setPageContext } from './usePageContext'
import type { PageContext } from 'vike/types'
import { setData } from './useData'

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

// Same as `Object.assign()` but with type inference
function objectAssign<Obj extends object, ObjAddendum>(
  obj: Obj,
  objAddendum: ObjAddendum
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum)
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function assertDataIsObject(data: unknown): asserts data is Record<string, unknown> {
  if (!isObject(data)) throw new Error('Return value of data() hook should be an object, undefined, or null')
}
