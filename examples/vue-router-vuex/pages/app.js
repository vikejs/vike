import { createSSRApp } from 'vue'
import { createRouter } from '../router/router'
import store from '../store/store'

export { createApp }

function createApp({ Page }) {
  const app = createSSRApp(Page)
  const router = createRouter()
  app.use(router).use(store)
  return { app, router, store }
}
