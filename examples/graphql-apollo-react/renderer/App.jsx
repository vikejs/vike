import React from 'react'
import { ApolloProvider } from '@apollo/client'
import './App.css'

export default App

function App({ apolloClient, children }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
