import React from "react";
import logo from "./logo.svg";
import { PageContext, Children } from "./types";
import { PageContextProvider } from "./usePageContext";
import "./PageWrapper.css";
import { Link } from "./Link";

export { PageWrapper };

function PageWrapper({
  pageContext,
  children,
}: {
  pageContext: PageContext;
  children: Children;
}) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Layout>
          <Sidebar>
            <Logo />
            <Link href="/">Welcome</Link>
            <Link href="/markdown">Markdown</Link>
            <Link href="/star-wars">Data Fetching</Link>
            <Link href="/hello/alice">Routing</Link>
          </Sidebar>
          <Content>{children}</Content>
        </Layout>
      </PageContextProvider>
    </React.StrictMode>
  );
}

function Layout({ children }: { children: Children }) {
  return (
    <div
      style={{
        display: "flex",
        maxWidth: 900,
        margin: "auto",
      }}
    >
      {children}
    </div>
  );
}

function Sidebar({ children }: { children: Children }) {
  return (
    <div
      style={{
        padding: 20,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        lineHeight: "1.8em",
        borderRight: "2px solid #eee",
      }}
    >
      {children}
    </div>
  );
}

function Content({ children }: { children: Children }) {
  return (
    <div
      id="page-content"
      style={{
        padding: 20,
        paddingBottom: 50,
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}

function Logo() {
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 10,
      }}
    >
      <a href="/">
        <img src={logo} height={64} width={64} />
      </a>
    </div>
  );
}
