export { render }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { getStore } from './store'

async function render(pageContext) {
  const { Page } = pageContext
  const store = getStore(pageContext.PRELOADED_STATE)
  hydrateRoot(
    document.getElementById('react-root'),
    <Provider store={store}>
      <Page />
    </Provider>,
  )
}
