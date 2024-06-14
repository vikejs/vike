export { render }

import { createVueApp } from './app'

async function render(pageContext) {
  const app = createVueApp(pageContext)
  app.mount('#app')
}
