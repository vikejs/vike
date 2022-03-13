export { PageShell };

import React from "react";
import { PageContextProvider } from "../hooks/usePageContext";

function PageShell({ pageContext, children }) {
  const PageLayout = pageContext.exports.PageLayout || Passthrough;
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <PageLayout>{children}</PageLayout>
      </PageContextProvider>
    </React.StrictMode>
  );
}

function Passthrough({ children }) {
  return <>{children}</>;
}
