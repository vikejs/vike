export { render }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import App from './App'

async function render(pageContext) {
  const { Page } = pageContext
  const apolloClient = makeApolloClient(pageContext.apolloIntialState)
  hydrateRoot(
    document.getElementById('page-content'),
    <App apolloClient={apolloClient}>
      <Page />
    </App>,
  )
}

function makeApolloClient(apolloIntialState) {
  return new ApolloClient({
    uri: 'https://countries.trevorblades.com',
    cache: new InMemoryCache().restore(apolloIntialState),
  })
}
