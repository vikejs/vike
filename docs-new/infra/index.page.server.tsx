import ReactDOMServer from 'react-dom/server'
import React from 'react'
import logo from '../icons/vite-plugin-ssr.svg'
import { html } from 'vite-plugin-ssr'
import { assert, slice, filter } from '../utils'
import { PageLayout } from './PageLayout'
import { Heading } from '../types'

type ReactComponent = () => JSX.Element
declare global {
  interface ImportMeta {
    glob: (path: string) => Record<string, () => Promise<{ default: ReactComponent }>>
    globEager: (path: string) => Record<string, { default: ReactComponent }>
  }
}

const docPages = getDocPages()

export { render }
export { addPageContext }

function render(pageContext: { PageContent: ReactComponent; headings: Heading[] }) {
  //const { Page, pageProps } = pageContext
  //const pageContent = ReactDOMServer.renderToString(<Page {...pageProps} />)
  const { PageContent, headings } = pageContext
  const page = (
    <PageLayout headings={headings}>
      <PageContent />
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

async function addPageContext(pageContext: { routeParams: { url: string } }) {
  const { url } = pageContext.routeParams
  const PageContent = await findPage(url)
  const headings = getHeadings()
  return { PageContent, headings }
}

async function findPage(url: string): Promise<ReactComponent> {
  if (url === '/') {
    const { LandingPage } = await import('./LandingPage')
    return LandingPage
  }
  let matches: string[] = []
  for (const filePath in docPages) {
    if (filePath.toLowerCase().includes(url.slice(1).toLowerCase())) {
      matches.push(filePath)
    }
  }
  assert(matches.length >= 1, { docPages, url, msg: 'Page not found' })
  assert(matches.length <= 1, { docPages, url, msg: 'Routing conflict' })
  //const Page = docPages[matches[0]].default
  const Page = (await docPages[matches[0]]()).default
  return Page
}

function getHeadings(): Heading[] {
  const headings = []
  for (const filePath in docPages) {
    const url = getDocPageUrl(filePath)
    const heading = {
      level: 3,
      id: url,
      title: url
    }
    headings.push(heading)
  }
  return headings
}

function getDocPages() {
  //console.log('r', import.meta.globEager('/**/*.mdx?raw'))
  //const markdownFiles = import.meta.globEager('/**/*.mdx')
  const markdownFiles = import.meta.glob('/**/*.mdx')
  const docPages = filter(markdownFiles, (_, fileName) => isPageDoc(fileName))
  return docPages
}

function isPageDoc(filePath: string) {
  const pathParts = filePath.split('/')
  const fileName = pathParts[pathParts.length - 1]
  if (!/[0-9]/.test(fileName[0])) {
    return false
  }
  assert(/[0-9]/.test(fileName[0]), { fileName })
  assert(/[0-9]/.test(fileName[1]), { fileName })
  assert('-' === fileName[2], { fileName })
  assert(fileName.endsWith('.mdx'), { fileName })
  return true
}
function getDocPageUrl(filePath: string): string {
  assert(isPageDoc(filePath))
  const pathParts = filePath.split('/')
  const fileName = pathParts[pathParts.length - 1]
  const url = slice(fileName, '00-'.length, -'.mdx'.length)
  assert(/[0-9]/.test(fileName[0]), { fileName })
  assert(/[0-9]/.test(fileName[1]), { fileName })
  assert('-' === fileName[2], { fileName })
  assert(fileName.endsWith('.mdx'), { fileName })
  return url
}
