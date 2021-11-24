import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { getStore } from './store'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'

export { render }
export { onBeforeRender }
export { passToClient }

const passToClient = ['PRELOADED_STATE']

async function render(pageContext) {
  const { pageHtml } = pageContext
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}

async function onBeforeRender(pageContext) {
  const store = getStore()

  const { Page } = pageContext
  const pageHtml = renderToString(
    <Provider store={store}>
      <Page />
    </Provider>,
  )

  // Grab the initial state from our Redux store
  const PRELOADED_STATE = store.getState()

  return {
    pageContext: {
      PRELOADED_STATE,
      pageHtml,
    },
  }
}
