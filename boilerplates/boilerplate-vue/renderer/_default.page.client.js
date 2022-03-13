import { createApp } from './app'

export { render }

async function render(pageContext) {
  // We do Server Routing, but we can also do Client Routing by using `useClientRouter()`
  // instead of `getPage()`, see https://vite-plugin-ssr.com/useClientRouter
  const app = createApp(pageContext)
  app.mount('#app')
}
