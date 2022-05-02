export { render }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'

async function render(pageContext) {
  const { Page } = pageContext
  hydrateRoot(document.getElementById('react-root'), <Page />)
}
