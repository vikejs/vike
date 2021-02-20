import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import PageLayout from '../components/PageLayout/PageLayout.vue'
import { html } from 'vite-plugin-ssr'

type InitialProps = {
  title?: string
}

export default {
  render
}

async function render(Page: any, initialProps: InitialProps) {
  const PageWithLayout = defineComponent({
    render() {
      return h(
        PageLayout,
        {},
        {
          default() {
            return h(Page, initialProps)
          }
        }
      )
    }
  })
  const app = createSSRApp(PageWithLayout)
  const pageHtml = await renderToString(app /*, ctx*/)

  const title = initialProps.title || 'Demo: vite-plugin-ssr'

  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${html.sanitize(title)}</title>
      </head>
      <body>
        <div id="app">${html.alreadySanitized(pageHtml)}</div>
      </body>
    </html>`
}
