export { render }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { getStore } from './store'

async function render(pageContext) {
  const { Page } = pageContext
  // We initilaize the store on every render because we use Server Routing. If we use Client Routing, then we should initialize the store only once instead.
  // (See https://vike.dev/server-routing-vs-client-routing for more information about Client Routing and Server Routing.)
  const store = getStore(pageContext.PRELOADED_STATE)
  hydrateRoot(
    document.getElementById('react-root'),
    <Provider store={store}>
      <Page />
    </Provider>
  )
}
