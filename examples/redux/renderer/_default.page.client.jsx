export { render }

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { getStore } from './store'

async function render(pageContext) {
  const { Page } = pageContext
  const store = getStore(pageContext.PRELOADED_STATE)
  ReactDOM.hydrate(
    <Provider store={store}>
      <Page />
    </Provider>,
    document.getElementById('react-root'),
  )
}
