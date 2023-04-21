import { createSSRApp } from 'vue'
import { createRouter } from './router'

export { createApp }

function createApp({ Page }) {
  const app = createSSRApp(Page)
  const router = createRouter()
  app.use(router)
  return { app, router }
}
