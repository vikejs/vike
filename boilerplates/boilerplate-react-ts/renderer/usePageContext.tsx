// `usePageContext` allows us to access `pageContext` in any React component.
// See https://vite-plugin-ssr.com/pageContext-anywhere

import React, { useContext } from 'react'
import type { PageContextCommon } from './types'

export { PageContextProvider }
export { usePageContext }

const Context = React.createContext<PageContextCommon>(undefined as any)

function PageContextProvider({ pageContext, children }: { pageContext: PageContextCommon; children: React.ReactNode }) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

function usePageContext() {
  const pageContext = useContext(Context)
  return pageContext
}
