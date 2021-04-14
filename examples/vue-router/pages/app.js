import { createSSRApp } from 'vue'
import App from '../App.vue';

export { createApp }

function createApp(props) {
  const app = createSSRApp(App, props)
  return app
}
