import React, { useContext } from 'react'

export { PageContextProvider }
export { usePageContext }

// @ts-ignore
const Context = globalThis.context = globalThis.context || React.createContext(undefined)

function PageContextProvider({ pageContext, children }: any) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

function usePageContext() {
  const pageContext = useContext(Context)
  return pageContext
}
