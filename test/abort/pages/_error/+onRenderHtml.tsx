export default onRenderHtml

import { redirect, render } from 'vike/abort'
import type { PageContextServer } from '../../renderer/types'
import onRenderHtmlRenderer from '../../renderer/+onRenderHtml'

// Tests `throw redirect()` and `throw render()` while rendering the error page
function onRenderHtml(pageContext: PageContextServer) {
  if (pageContext.urlPathname === '/error-page-redirect-with-cookie') {
    pageContext.headersResponse.append('Set-Cookie', 'cookie-set-by-error-page=1; Path=/')
    throw redirect('/')
  }
  if (pageContext.urlPathname === '/error-page-render-with-cookie') {
    throw render(500)
  }
  return onRenderHtmlRenderer(pageContext)
}
