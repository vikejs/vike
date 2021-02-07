import ReactDOM from 'react-dom'
import React from 'react'

export default hydrate

async function hydrate({ pageView, initialProps }: any) {
  const app = React.createElement(pageView, initialProps)
  //@ts-ignore
  ReactDOM.hydrate(app, document.getElementById('page-view'))
  console.log('initialProps:', initialProps)
}
