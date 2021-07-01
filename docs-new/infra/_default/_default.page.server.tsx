import ReactDOMServer from 'react-dom/server'
import React from 'react'
import logo from '../../icons/vite-plugin-ssr.svg'
import { html } from 'vite-plugin-ssr'
import { PageLayout } from '../PageLayout'
import { Heading } from '../../types'
import { navItems } from '../headings'

type ReactComponent = () => JSX.Element
declare global {
  interface ImportMeta {
    glob: (path: string) => Record<string, () => Promise<{ default: ReactComponent }>>
    globEager: (path: string) => Record<string, { default: ReactComponent }>
  }
}

export { render }

function render(pageContext: { Page: ReactComponent, PageContent: ReactComponent; headings: Heading[] }) {
  const headings = getHeadings()
  const { Page } = pageContext
  const page = (
    <PageLayout headings={headings}>
      <Page />
    </PageLayout>
  )
  const pageHtml = ReactDOMServer.renderToString(page)
  return html`<!DOCTYPE html>
    <html>
      <head>
        <link rel="icon" href="${logo}" />
        <title>Vite SSR Plugin</title>
        <meta name="description" content="Add SSR to your Vite app." />
        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      </head>
      <body>
        <div id="page-view">${html.dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}

function getHeadings(): Heading[] {
  const headings = []
  for (const navItem of navItems) {
    const { level: _level, url: _url, title } = navItem
    const level = _level + 1
    const url = _url || '/fake-url'
    const id = url
    const heading = {
      level,
      id,
      url,
      title
    }
    headings.push(heading)
  }
  return headings
}
