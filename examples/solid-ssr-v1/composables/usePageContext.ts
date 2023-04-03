import { createContext, useContext } from 'solid-js'

import { IPageContext } from '#/types'

export const PageContext = createContext<IPageContext>()

/** Access the pageContext from any SolidJS component */
export function usePageContext() {
  const pageContext = useContext(PageContext)
  if (!pageContext) throw new Error('<PageContextProvider> is needed for being able to use usePageContext()')
  return pageContext
}
