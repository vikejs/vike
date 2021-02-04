import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { PageConfig } from 'vite-plugin-ssr'

const pageConfig: PageConfig = {
  render(view) {
    const initialProps = {} // TODO
    const viewElement = React.createElement(view, initialProps)
    const viewHtml = ReactDOMServer.renderToString(viewElement)
    return viewHtml
  }
  /*
  html({ title, viewHtml }) {
    return html(require.resolve("./index.html"), {
      title,
      viewHtml,
    });
  },
  */
}

export default pageConfig
