import { assert } from './utils/assert'
import { route } from './route.shared'
import { Html, Url, PageId, PageView, PageServerConfig } from './types'
import { loadUserFile } from './findUserFiles'
import { renderHtmlTemplate } from './renderHtml'

export { PageConfig, addWindowType } from './types'
export { render }

async function render(url: Url): Promise<Html | null> {
  const pageId = await route(url)
  if (!pageId) {
    return null
  }
  const html = await renderPageToHtml(pageId, url)
  return html
}

async function renderPageToHtml(pageId: PageId, url: Url): Promise<Html> {
  const pageView: PageView = await loadUserFile('.page', { pageId })
  let htmlTemplate: Html =
    (await loadUserFile('.html', { pageId })) ||
    (await loadUserFile('.html', { defaultFile: true }))
  assert(htmlTemplate)
  const pageServerConfig: PageServerConfig =
    (await loadUserFile('.server', { pageId })) ||
    (await loadUserFile('.server', { defaultFile: true }))
  assert(pageServerConfig.render)

  const pageViewHtml: Html = await pageServerConfig.render({ pageView })

  htmlTemplate = await applyViteHtmlTransform(htmlTemplate, url)

  const initialProps = {}
  const html = renderHtmlTemplate({
    htmlTemplate,
    pageViewHtml,
    scripts: [{ scriptUrl: '/@vite-plugin-ssr/client/browser-dev-entry' }],
    initialProps
  })

  return html
}

async function applyViteHtmlTransform(html: Html, url: Url): Promise<Html> {
  // @ts-ignore
  const { viteServer } = global
  assert(viteServer)
  html = await viteServer.transformIndexHtml(url, html)
  return html
}
