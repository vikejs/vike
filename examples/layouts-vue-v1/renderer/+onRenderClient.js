export default onRenderClient

import { createApp } from './app'
import './app.css'

let app
async function onRenderClient(pageContext) {
  if (!app) {
    app = createApp(pageContext)
    app.mount('#app')
  } else {
    app.changePage(pageContext)
  }
}
