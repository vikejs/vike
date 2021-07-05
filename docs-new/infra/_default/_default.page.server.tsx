import ReactDOMServer from 'react-dom/server'
import React from 'react'
import logo from '../../icons/vite-plugin-ssr.svg'
import { html } from 'vite-plugin-ssr'
import { PageLayout } from '../PageLayout'
import { Heading, headings } from '../headings'
import { assert } from '../../utils'
import { jsxToTextContent } from '../../utils/jsxToTextContent'

type ReactComponent = () => JSX.Element
declare global {
  interface ImportMeta {
    glob: (path: string) => Record<string, () => Promise<{ default: ReactComponent }>>
    globEager: (path: string) => Record<string, { default: ReactComponent }>
  }
}

export { render }

function render(pageContext: { url: string; Page: ReactComponent; PageContent: ReactComponent; headings: Heading[] }) {
  let activeHeadingIdx: number | undefined
  let activeHeading: Heading | undefined
  const headings2: Heading[] = headings.map((heading, i) => {
    if (heading.url === pageContext.url) {
      assert(activeHeadingIdx === undefined)
      activeHeadingIdx = i
      activeHeading = heading
      assert(heading.level === 2)
      const heading_: Heading = { ...heading, isActive: true }
      return heading_
    }
    return heading
  })
  assert(typeof activeHeadingIdx === 'number')
  assert(activeHeading)
  const { Page } = pageContext
  const page = (
    <PageLayout headings={headings2} activeHeadingIdx={activeHeadingIdx}>
      <Page />
    </PageLayout>
  )
  const pageHtml = ReactDOMServer.renderToString(page)
  const isLandingPage = pageContext.url === '/'
  const desc = html.dangerouslySkipEscape(
    '<meta name="description" content="Like Next.js / Nuxt but as do-one-thing-do-it-well Vite plugin." />'
  )
  return html`<!DOCTYPE html>
    <html>
      <head>
        <link rel="icon" href="${logo}" />
        <title>${activeHeading.titleDocument || jsxToTextContent(activeHeading.title)}</title>
        ${isLandingPage ? desc : ''}
      </head>
      <body>
        <div id="page-view">${html.dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
