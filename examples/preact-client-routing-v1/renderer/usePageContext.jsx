// `usePageContext` allows us to access `pageContext` in any React component.
// More infos: https://vite-plugin-ssr.com/pageContext-anywhere

import { createContext } from 'preact'
import { useContext } from 'preact/hooks'

export { PageContextProvider }
export { usePageContext }

const Context = createContext(undefined)

const PageContextProvider = function ({ pageContext, children }) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

function usePageContext() {
  const pageContext = useContext(Context)
  return pageContext
}
