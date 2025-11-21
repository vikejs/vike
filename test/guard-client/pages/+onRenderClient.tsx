export { onRenderClient }

import React from 'react'
import ReactDOM from 'react-dom/client'
import type { OnRenderClientAsync } from 'vike/types'

const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  const { Page } = pageContext
  const container = document.getElementById('page-view')!
  const root = ReactDOM.createRoot(container)
  root.render(<Page {...pageContext} />)
}
