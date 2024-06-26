// https://vike.dev/onRenderClient
export { onRenderClient }

import { Layout } from './Layout'

async function onRenderClient(pageContext) {
  if (!pageContext.isHydration) {
    const { Page } = pageContext
    const pageHtml = Layout(Page)
    document.getElementById('page-view').innerHTML = pageHtml
  }
  hydrateCounters()
}

function hydrateCounters() {
  document.querySelectorAll('.counter').forEach((counter) => {
    let count = 0
    counter.onclick = () => {
      counter.textContent = `Counter ${++count}`
    }
  })
}
