export { render }
export const clientRouting = true
export const hydrationCanBeAborted = true

import ReactDOM from 'react-dom/client'
import { Layout } from './Layout'

let root
async function render(pageContext) {
  const { Page, pageProps } = pageContext

  const page = (
    <Layout>
      <Page {...pageProps} />
    </Layout>
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
