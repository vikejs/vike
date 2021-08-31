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
