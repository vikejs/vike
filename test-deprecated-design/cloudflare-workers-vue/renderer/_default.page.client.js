import { createVueApp } from './createVueApp'

export { render }

async function render(pageContext) {
  const app = createVueApp(pageContext)
  app.mount('#app')
}
