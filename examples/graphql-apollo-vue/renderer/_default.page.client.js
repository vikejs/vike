export { render }

import { createApp } from './app'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import fetch from 'cross-fetch'

function render(pageContext) {
  const defaultClient = new ApolloClient({
    link: new HttpLink({ uri: 'https://rickandmortyapi.com/graphql', fetch }),
    cache: new InMemoryCache().restore(pageContext.apolloInitialState),
    connectToDevTools: true,
  })

  const app = createApp(pageContext, defaultClient)
  app.mount('#app')
}
