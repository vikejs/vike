export { usePageContext }
export { PageContextProvider }

import { useContext, createContext, type JSX } from 'solid-js'
import { type Store } from 'solid-js/store'
import type { PageContext } from './types'

const Context = createContext<Store<PageContext>>()

function PageContextProvider(props: { pageContext: Store<PageContext>; children: JSX.Element }) {
  if (!props.pageContext) throw new Error('Argument pageContext missing')
  return <Context.Provider value={props.pageContext}>{props.children}</Context.Provider>
}

/** Access the pageContext from any SolidJS component */
function usePageContext() {
  const pageContext = useContext(Context)
  if (!pageContext) throw new Error('<PageContextProvider> is needed for being able to use usePageContext()')
  return pageContext
}
