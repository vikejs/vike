export default onRenderClient

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import App from './App'

async function onRenderClient(pageContext) {
  const { Page } = pageContext
  const apolloClient = makeApolloClient(pageContext.apolloInitialState)
  hydrateRoot(
    document.getElementById('page-content'),
    <App apolloClient={apolloClient}>
      <Page />
    </App>,
  )
}

function makeApolloClient(apolloInitialState) {
  return new ApolloClient({
    uri: 'https://countries.trevorblades.com',
    cache: new InMemoryCache().restore(apolloInitialState),
  })
}
