import { getPage } from 'vite-plugin-ssr/client'
import { createApp } from './app'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import fetch from 'cross-fetch'

hydrate()

async function hydrate() {
  // We do Server Routing, but we can also do Client Routing by using `useClientRouter()`
  // instead of `getPage()`, see https://vite-plugin-ssr.com/useClientRouter
  const pageContext = await getPage()
  const defaultClient = new ApolloClient({
    link: new HttpLink({ uri: 'https://rickandmortyapi.com/graphql', fetch }),
    cache: new InMemoryCache().restore(pageContext.apolloInitialState),
    connectToDevTools: true,
  })

  const app = createApp(pageContext, defaultClient)
  app.mount('#app')
}
