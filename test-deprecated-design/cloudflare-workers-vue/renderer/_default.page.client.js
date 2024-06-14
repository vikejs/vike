import { createVueApp } from './app'

export { render }

async function render(pageContext) {
  const app = createVueApp(pageContext)
  app.mount('#app')
}
