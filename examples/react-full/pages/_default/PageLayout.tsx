import React from "react";
import logo from "./logo.svg";
import "./PageLayout.css";

export { PageLayout };

type Children = React.ReactNode;

function PageLayout({ children }: { children: Children }) {
  return (
    <React.StrictMode>
      <Layout>
        <Sidebar>
          <Logo />
          <a href="/markdown">Markdown</a>
          <a href="/star-wars">Data Fetching</a>
          <a href="/hello/alice">Routing</a>
        </Sidebar>
        <Content>{children}</Content>
      </Layout>
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
