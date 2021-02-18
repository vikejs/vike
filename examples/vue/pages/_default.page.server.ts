import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import PageLayout from '../components/PageLayout/PageLayout.vue'

type InitialProps = {
  title?: string
}

export default {
  addInitialProps,
  render,
  html
}

function addInitialProps(initialProps: InitialProps) {
  return {
    title: initialProps.title || 'Demo: vite-plugin-ssr'
  }
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
  const html = await renderToString(app /*, ctx*/)
  return html
}

function html(pageHtml: string, initialProps: InitialProps) {
  const { title } = initialProps
  const variables = {
    title,
    pageHtml
  }
  const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>$title</title>
  </head>
  <body>
    <div id="app">$pageHtml</div>
  </body>
</html>`
  return { template, variables }
}
