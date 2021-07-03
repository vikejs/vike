import ReactDOMServer from 'react-dom/server'
import React from 'react'
import logo from '../../icons/vite-plugin-ssr.svg'
import { html } from 'vite-plugin-ssr'
import { PageLayout } from '../PageLayout'
import { Heading, headings } from '../headings'
import { assert } from '../../utils'

type ReactComponent = () => JSX.Element
declare global {
  interface ImportMeta {
    glob: (path: string) => Record<string, () => Promise<{ default: ReactComponent }>>
    globEager: (path: string) => Record<string, { default: ReactComponent }>
  }
}

export { render }

function render(pageContext: { url: string; Page: ReactComponent; PageContent: ReactComponent; headings: Heading[] }) {
  let activeHeading: number | undefined
  const headings2: Heading[] = headings.map((heading, i) => {
    if (heading.url === pageContext.url) {
      assert(activeHeading === undefined)
      activeHeading = i
      assert(heading.level === 2)
      const heading_: Heading = { ...heading, isActive: true }
      return heading_
    }
    return heading
  })
  assert(typeof activeHeading === 'number')
  const { Page } = pageContext
  const page = (
    <PageLayout headings={headings2} activeHeading={activeHeading}>
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
