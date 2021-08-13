import React, { useContext } from "react";
import { PageContext, Children } from "./types";

export { PageContextProvider };
export { usePageContext };

const ReactPageContext = React.createContext<PageContext>(undefined as any);

function PageContextProvider({
  pageContext,
  children,
}: {
  pageContext: PageContext;
  children: Children;
}) {
  return (
    <ReactPageContext.Provider value={pageContext}>
      {children}
    </ReactPageContext.Provider>
  );
}

function usePageContext() {
  const pageContext = useContext(ReactPageContext);
  return pageContext;
}
