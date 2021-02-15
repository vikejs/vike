import ReactDOMServer from 'react-dom/server'
import React from 'react'

export default {
  render,
  html
}

function render({ pageView }: any) {
  const initialProps = {} // TODO
  const viewElement = React.createElement(pageView, initialProps)
  const viewHtml = ReactDOMServer.renderToString(viewElement)
  return viewHtml
}

function html({ pageHtml }: any) {
  const variables = {
    title: 'bla',
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
    <div id="page-view">$pageHtml</div>
  </body>
</html>`
  return { template, variables }
}
