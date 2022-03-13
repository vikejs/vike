export { render }

import React from 'react'
import ReactDOM from 'react-dom'

async function render(pageContext) {
  const { Page } = pageContext
  ReactDOM.hydrate(<Page />, document.getElementById('react-root'))
}
