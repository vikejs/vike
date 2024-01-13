// https://vike.dev/usePageContext
// eslint-disable-next-line react-refresh/only-export-components
export { usePageContext }
export { PageContextProvider }

import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { childrenPropType } from './PropTypeValues'

const Context = React.createContext(undefined)

PageContextProvider.propTypes = {
  pageContext: PropTypes.any,
  children: childrenPropType
}
function PageContextProvider({ pageContext, children }) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

/** https://vike.dev/usePageContext */
function usePageContext() {
  const pageContext = useContext(Context)
  return pageContext
}
