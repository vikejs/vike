// `usePageContext` allows us to access `pageContext` in any React component.
// See https://vite-plugin-ssr.com/pageContext-anywhere

import React, { useContext } from 'react'

export { PageContextProvider }
export { usePageContext }

const Context = React.createContext(undefined)

function PageContextProvider({ pageContext, children }) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

function usePageContext() {
  const pageContext = useContext(Context)
  return pageContext
}
