export { render }

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import apolloClient from '@apollo/client'
const { ApolloClient, InMemoryCache } = apolloClient
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
