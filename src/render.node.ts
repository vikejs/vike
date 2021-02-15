import { route } from './route.shared'
import { renderPageHtml } from './renderPageHtml.node'
export { render }

async function render(url: string): Promise<string | null> {
  const pageId = await route(url)
  if (!pageId) {
    return null
  }
  const html = await renderPageHtml(pageId, url)
  return html
}
