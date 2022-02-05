// `usePageContext` allows us to access `pageContext` in any React component.
// More infos: https://vite-plugin-ssr.com/pageContext-anywhere

import { createContext, FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";
import type { PageContext } from "./types";

export { PageContextProvider };
export { usePageContext };

const Context = createContext<PageContext>(undefined as any);

const PageContextProvider: FunctionalComponent<{ pageContext: PageContext }> =
  function ({ pageContext, children }) {
    return <Context.Provider value={pageContext}>{children}</Context.Provider>;
  };

function usePageContext() {
  const pageContext = useContext(Context);
  return pageContext;
}
