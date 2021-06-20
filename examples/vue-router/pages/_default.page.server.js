import { renderToString } from '@vue/server-renderer'
import { html } from 'vite-plugin-ssr'
import { createApp } from './app'
import { createMemoryHistory, createRouter } from 'vue-router'
import { vitePluginSsrRoutes } from '@vite-plugin-ssr/vue-router/server/plugin';

export { render }

async function render(pageContext) {
  const { Page } = pageContext
  const app = createApp({})

  const router = createRouter({
    history: createMemoryHistory(),
    routes: []
  });

  app.use(router);
  app.use(vitePluginSsrRoutes(pageContext));

  // set the router to the desired URL before rendering
  router.push(pageContext.url)
  await router.isReady()

  const appHtml = await renderToString(app)

  return html`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${html.dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`
}
