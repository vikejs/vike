import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client'
import React from 'react'
import { PageLayout } from './_default/PageLayout'

export default App

type Props = {
  client: ApolloClient<NormalizedCacheObject>
  children: JSX.Element
}

function App({ client, children }: Props) {
  return (
    <ApolloProvider client={client}>
      <PageLayout>
        {children}
      </PageLayout>
    </ApolloProvider>
  )
}
