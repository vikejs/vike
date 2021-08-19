import React, { useContext } from "react";

export { PageContextProvider };
export { usePageContext };

const ReactPageContext = React.createContext(undefined);

function PageContextProvider({ pageContext, children }) {
  return <ReactPageContext.Provider value={pageContext}>{children}</ReactPageContext.Provider>;
}

function usePageContext() {
  const pageContext = useContext(ReactPageContext);
  return pageContext;
}
