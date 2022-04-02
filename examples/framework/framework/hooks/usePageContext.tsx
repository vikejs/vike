import React, { useContext } from 'react'
import { Children, PageContext } from '../types'

export { PageContextProvider }
export { usePageContext }

// @ts-ignore
const Context = (globalThis.context = globalThis.context || React.createContext(undefined))

function PageContextProvider({ pageContext, children }: { pageContext: PageContext; children: Children }) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

function usePageContext() {
  const pageContext = useContext<PageContext>(Context)
  return pageContext
}
