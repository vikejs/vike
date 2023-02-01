export default onRenderClient

import { PageLayout } from './PageLayout'

async function onRenderClient(pageContext) {
  const { Page } = pageContext
  const pageHtml = PageLayout(Page)
  document.getElementById('page-view').innerHTML = pageHtml
}
