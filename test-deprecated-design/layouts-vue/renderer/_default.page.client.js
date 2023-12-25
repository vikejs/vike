export { render }
export const clientRouting = true

import { createApp } from './app'
import './app.css'

let app
async function render(pageContext) {
  if (!app) {
    app = createApp(pageContext)
    app.mount('#app')
  } else {
    app.changePage(pageContext)
  }
}
