import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { PageLayout } from '../../components/PageLayout/PageLayout'

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
    title: initialProps.title || 'Vite SSR Demo'
  }
}

function render(pageView: string, initialProps: InitialProps) {
  const app = (
    <PageLayout>{React.createElement(pageView, initialProps)}</PageLayout>
  )
  return ReactDOMServer.renderToString(app)
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
    <div id="page-view">$pageHtml</div>
  </body>
</html>`
  return { template, variables }
}
