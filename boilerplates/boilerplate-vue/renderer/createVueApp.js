export { createVueApp }

import { createSSRApp, h, shallowRef } from 'vue'
import { setPageContext } from './usePageContext'
import { setData } from './useData'
import Layout from './Layout.vue'

function createVueApp(pageContext) {
  const pageContextRef = shallowRef(pageContext)
  const dataRef = shallowRef(pageContext.data)
  const pageRef = shallowRef(pageContext.Page)

  const RootComponent = () => h(Layout, null, () => h(pageRef.value))
  const app = createSSRApp(RootComponent)
  setPageContext(app, pageContextRef)
  setData(app, dataRef)

  // app.changePage() is called upon navigation, see +onRenderClient.ts
  Object.assign(app, {
    changePage: (pageContext) => {
      pageContextRef.value = pageContext
      dataRef.value = pageContext.data
      pageRef.value = pageContext.Page
    },
  })

  return app
}
