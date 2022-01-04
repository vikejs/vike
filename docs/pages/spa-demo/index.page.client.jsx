import ReactDOM from 'react-dom'
import React from 'react'
import { Page } from './index.page'

hydrate()

async function hydrate() {
  ReactDOM.render(<Page />, document.getElementById('page-view'))
}
