// https://vike.dev/usePageContext
export { usePageContext }
export { PageContextProvider }

import React, { useContext } from 'react'

const Context = React.createContext()

function PageContextProvider({ pageContext, children }) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

function usePageContext() {
  const pageContext = useContext(Context)
  return pageContext
}
