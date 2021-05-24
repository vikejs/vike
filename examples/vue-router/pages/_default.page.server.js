import { renderToString } from '@vue/server-renderer'
import { html } from 'vite-plugin-ssr'
import { createApp } from './app'
import { createMemoryHistory, createRouter } from 'vue-router'
import { vitePluginSsrRoutes } from '@vite-plugin-ssr/vue-router/server/plugin';

export { render }

async function render({ Page, contextProps }) {
  const app = createApp({})

  const router = createRouter({
    history: createMemoryHistory(),
    routes: []
  });

  app.use(router);
  app.use(vitePluginSsrRoutes({ contextProps, Page }));

  // set the router to the desired URL before rendering
  router.push(contextProps.urlFull)
  await router.isReady()

  const appHtml = await renderToString(app)

  return html`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${html.dangerouslySetHtml(appHtml)}</div>
      </body>
    </html>`
}
