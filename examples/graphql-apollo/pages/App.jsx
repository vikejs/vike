import React from "react";
import { ApolloProvider } from "@apollo/client";
import './App.css';

export default App

function App({ client, children }) {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}
