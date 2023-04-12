import { createApp } from './app'

export { render }

async function render(pageContext) {
  const app = createApp(pageContext)
  app.mount('#app')
}
