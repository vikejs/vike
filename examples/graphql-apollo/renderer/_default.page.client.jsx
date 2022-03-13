export { render }

import ReactDOM from 'react-dom'
import React from 'react'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import App from './App'

async function render(pageContext) {
  const { Page } = pageContext
  const apolloClient = makeApolloClient(pageContext.apolloIntialState)
  ReactDOM.hydrate(
    <App apolloClient={apolloClient}>
      <Page />
    </App>,
    document.getElementById('page-content'),
  )
}

function makeApolloClient(apolloIntialState) {
  return new ApolloClient({
    uri: 'https://countries.trevorblades.com',
    cache: new InMemoryCache().restore(apolloIntialState),
  })
}
