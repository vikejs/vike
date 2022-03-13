export { render }

import ReactDOM from 'react-dom'
import React from 'react'
import { PageContext } from './types'

async function render(pageContext: PageContext) {
  const { Page } = pageContext
  ReactDOM.hydrate(<Page />, document.getElementById('page-view'))
}
