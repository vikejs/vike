import React from 'react'
import apolloClient from '@apollo/client'
const { ApolloProvider } = apolloClient
import './App.css'

export default App

function App({ apolloClient, children }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
