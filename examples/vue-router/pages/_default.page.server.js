import { renderToString } from '@vue/server-renderer'
import { html } from 'vite-plugin-ssr'
import { createApp } from './app'
import { createMemoryHistory, createRouter } from 'vue-router'

export { render }

async function render({ Page, contextProps }) {
  const app = createApp({ routes: contextProps.routes })

  const contextPropsByPath = {
    [contextProps.url]: contextProps
  };

  const router = createRouter({
    history: createMemoryHistory(),
    routes: contextProps.routes.map(route => ({
      name: route.id,
      path: route.pageRoute,
      meta: {
        isViteSsrPageRoute: true
      },
      props: (route) => contextPropsByPath[route.fullPath],
      component: Page
    }))
  });

  app.use(router);

  // set the router to the desired URL before rendering
  
  router.push(contextProps.url)

  await router.isReady()

  const appHtml = await renderToString(app)

  return html`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${html.dangerouslySetHtml(appHtml)}</div>
      </body>
    </html>`
}
