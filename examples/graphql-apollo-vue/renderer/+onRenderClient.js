// https://vike.dev/onRenderClient
export { onRenderClient }

import { createVueApp } from './createVueApp'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import fetch from 'cross-fetch'

function onRenderClient(pageContext) {
  const defaultClient = new ApolloClient({
    link: new HttpLink({ uri: 'https://countries.trevorblades.com', fetch }),
    cache: new InMemoryCache().restore(pageContext.apolloInitialState),
    connectToDevTools: true
  })

  const app = createVueApp(pageContext, defaultClient)
  app.mount('#app')
}
