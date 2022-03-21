export { render }
export const clientRouting = true

import ReactDOM from 'react-dom'
import { PageLayout } from './PageLayout'

async function render(pageContext) {
  const { Page, pageProps } = pageContext

  const pageEl = (
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>
  )

  const reactContainer = document.getElementById('react-container')
  if (reactContainer.innerHTML === '') {
    // SPA
    ReactDOM.render(pageEl, reactContainer)
  } else {
    // SSR
    ReactDOM.hydrate(pageEl, reactContainer)
  }
}
