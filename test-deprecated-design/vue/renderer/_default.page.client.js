export { render }

import { createVueApp } from './createVueApp'

async function render(pageContext) {
  const app = createVueApp(pageContext)
  app.mount('#app')
}
