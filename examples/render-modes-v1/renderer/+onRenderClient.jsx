// https://vike.dev/onRenderClient
export default onRenderClient

import ReactDOM from 'react-dom/client'
import { PageLayout } from './PageLayout'

let root
async function onRenderClient(pageContext) {
  const { Page, pageProps } = pageContext

  const page = (
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>
  )

  const container = document.getElementById('react-container')
  // SPA
  if (container.innerHTML === '' || !pageContext.isHydration) {
    if (!root) {
      root = ReactDOM.createRoot(container)
    }
    root.render(page)
    // SSR
  } else {
    root = ReactDOM.hydrateRoot(container, page)
  }
}
